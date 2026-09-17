export type DocumentFormat = 'hwp' | 'hwpx'

const formatExtensions: Record<DocumentFormat, string> = {
  hwp: '.hwp',
  hwpx: '.hwpx',
}

const formatMimeTypes: Record<DocumentFormat, string> = {
  hwp: 'application/x-hwp',
  hwpx: 'application/vnd.hancom.hwpx',
}

/** 파일 확장자로 지원 문서 형식을 판별한다. */
export function detectDocumentFormat(fileName: string): DocumentFormat | undefined {
  const extension = fileName.trim().toLowerCase().split('.').pop()
  return extension === 'hwp' || extension === 'hwpx' ? extension : undefined
}

/** 원래 이름을 유지하면서 저장 형식에 맞는 확장자만 바꾼다. */
export function downloadFileName(fileName: string, format: DocumentFormat): string {
  const normalizedName = fileName.trim() || 'document'
  const baseName = normalizedName.replace(/\.(hwp|hwpx)$/i, '') || 'document'
  return `${baseName}${formatExtensions[format]}`
}

/** 다운로드 Blob에 사용할 파일 형식별 MIME type을 반환한다. */
export function exportMimeType(format: DocumentFormat): string {
  return formatMimeTypes[format]
}
