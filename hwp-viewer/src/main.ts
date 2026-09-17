import { createEditor } from '@rhwp/editor'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('앱을 시작할 DOM 요소를 찾지 못했습니다.')
}

app.innerHTML = `
  <main class="shell" aria-label="한글 문서 편집기">
    <header class="app-header">
      <a class="brand" href="/" aria-label="한글 문서 편집기 홈">
        <span class="brand-mark" aria-hidden="true">ㅎ</span>
        <span>한글 문서 편집기</span>
      </a>
      <div class="app-actions">
        <input id="file-input" type="file" accept=".hwp,.hwpx" hidden />
        <button id="open-file" class="button button-secondary" type="button">파일 열기</button>
        <button id="export-hwpx" class="button button-primary" type="button" disabled>HWPX 저장</button>
      </div>
    </header>
    <section class="workspace" aria-label="문서 작업 영역">
      <div id="editor" class="editor-host" aria-busy="true">
        <div class="loading" role="status">편집기를 불러오는 중입니다…</div>
      </div>
    </section>
    <p id="status-message" class="status-message" role="status">파일은 브라우저 안에서만 처리됩니다.</p>
  </main>
`

const editorHost = document.querySelector<HTMLDivElement>('#editor')
const fileInput = document.querySelector<HTMLInputElement>('#file-input')
const openFileButton = document.querySelector<HTMLButtonElement>('#open-file')
const exportHwpxButton = document.querySelector<HTMLButtonElement>('#export-hwpx')
const statusMessage = document.querySelector<HTMLParagraphElement>('#status-message')

if (!editorHost || !fileInput || !openFileButton || !exportHwpxButton || !statusMessage) {
  throw new Error('편집기를 붙일 영역을 찾지 못했습니다.')
}

function setStatus(message: string, isError = false) {
  statusMessage?.replaceChildren(message)
  if (statusMessage) statusMessage.dataset.state = isError ? 'error' : 'default'
}

function download(bytes: Uint8Array, filename: string, mimeType: string) {
  const copiedBytes = new Uint8Array(bytes)
  const url = URL.createObjectURL(new Blob([copiedBytes.buffer], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

try {
  editorHost.innerHTML = ''
  const editor = await createEditor('#editor', {
    width: '100%',
    height: '100%',
  })
  editorHost.setAttribute('aria-busy', 'false')
  exportHwpxButton.disabled = false

  openFileButton.addEventListener('click', () => fileInput.click())
  fileInput.addEventListener('change', async () => {
    const [file] = fileInput.files ?? []
    if (!file) return

    try {
      setStatus(`${file.name} 여는 중…`)
      await editor.loadFile(await file.arrayBuffer(), file.name)
      setStatus(`${file.name}을(를) 열었습니다. 편집 후 HWPX 저장을 누르세요.`)
    } catch (error) {
      console.error('Document load failed', error)
      setStatus(`${file.name}을(를) 열지 못했습니다. 지원되는 HWP 또는 HWPX 파일인지 확인해 주세요.`, true)
    } finally {
      fileInput.value = ''
    }
  })

  exportHwpxButton.addEventListener('click', async () => {
    try {
      exportHwpxButton.disabled = true
      setStatus('HWPX 파일을 만드는 중…')
      const bytes = await editor.exportHwpx()
      download(bytes, 'document.hwpx', 'application/hwp+zip')
      setStatus('HWPX 파일을 다운로드했습니다.')
    } catch (error) {
      console.error('HWPX export failed', error)
      setStatus('HWPX 저장에 실패했습니다. 문서를 연 뒤 다시 시도해 주세요.', true)
    } finally {
      exportHwpxButton.disabled = false
    }
  })
} catch (error) {
  editorHost.setAttribute('aria-busy', 'false')
  editorHost.innerHTML = `
    <div class="error-state" role="alert">
      <h1>편집기를 불러오지 못했습니다</h1>
      <p>네트워크 연결을 확인한 뒤 새로고침해 주세요.</p>
      <button type="button" onclick="location.reload()">다시 시도</button>
    </div>
  `
  setStatus('편집기를 시작하지 못했습니다.', true)
  console.error('rhwp editor initialization failed', error)
}
