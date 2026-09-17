// iframe 에디터를 Vite의 개발용 의존성 사전 번들링 없이 원본 ESM으로 불러온다.
import { createEditor } from '../node_modules/@rhwp/editor/index.js'
import {
  detectDocumentFormat,
  downloadFileName,
  exportMimeType,
  type DocumentFormat,
} from './document-file'
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
        <label class="save-format-label" for="save-format">저장 형식</label>
        <select id="save-format" class="save-format" aria-label="저장 형식">
          <option value="hwpx">HWPX</option>
          <option value="hwp">HWP</option>
        </select>
        <button id="export-document" class="button button-primary" type="button" disabled>저장</button>
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
const saveFormatSelect = document.querySelector<HTMLSelectElement>('#save-format')
const exportDocumentButton = document.querySelector<HTMLButtonElement>('#export-document')
const statusMessage = document.querySelector<HTMLParagraphElement>('#status-message')

if (!editorHost || !fileInput || !openFileButton || !saveFormatSelect || !exportDocumentButton || !statusMessage) {
  throw new Error('편집기를 붙일 영역을 찾지 못했습니다.')
}

let currentFileName = 'document'

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
    ...(import.meta.env.VITE_RHWP_STUDIO_URL
      ? { studioUrl: import.meta.env.VITE_RHWP_STUDIO_URL }
      : {}),
  })
  editorHost.setAttribute('aria-busy', 'false')
  exportDocumentButton.disabled = false

  openFileButton.addEventListener('click', () => fileInput.click())
  fileInput.addEventListener('change', async () => {
    const [file] = fileInput.files ?? []
    if (!file) return

    const sourceFormat = detectDocumentFormat(file.name)
    if (!sourceFormat) {
      setStatus('HWP 또는 HWPX 파일만 열 수 있습니다.', true)
      return
    }

    try {
      setStatus(`${file.name} 여는 중…`)
      await editor.loadFile(await file.arrayBuffer(), file.name)
      currentFileName = file.name
      saveFormatSelect.value = sourceFormat
      setStatus(`${file.name}을(를) 열었습니다. 편집 후 저장을 누르세요.`)
    } catch (error) {
      console.error('Document load failed', error)
      setStatus(`${file.name}을(를) 열지 못했습니다. 지원되는 HWP 또는 HWPX 파일인지 확인해 주세요.`, true)
    } finally {
      fileInput.value = ''
    }
  })

  exportDocumentButton.addEventListener('click', async () => {
    const format = saveFormatSelect.value as DocumentFormat
    const outputFileName = downloadFileName(currentFileName, format)

    try {
      exportDocumentButton.disabled = true
      setStatus(`${format.toUpperCase()} 파일을 만드는 중…`)
      const bytes = format === 'hwp' ? await editor.exportHwp() : await editor.exportHwpx()
      download(bytes, outputFileName, exportMimeType(format))
      setStatus(`${outputFileName} 파일을 다운로드했습니다.`)

      // 브라우저 다운로드가 시작된 뒤에만 저장 완료를 알린다. 실패해도 내려받은 파일은 유지된다.
      try {
        await editor.notifySaved(outputFileName)
      } catch (error) {
        console.warn('Saved-state notification was not available', error)
      }
    } catch (error) {
      console.error('Document export failed', error)
      setStatus(`${format.toUpperCase()} 저장에 실패했습니다. 문서를 연 뒤 다시 시도해 주세요.`, true)
    } finally {
      exportDocumentButton.disabled = false
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
