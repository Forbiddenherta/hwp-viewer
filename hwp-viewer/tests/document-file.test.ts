import { describe, expect, it } from 'vitest'
import { detectDocumentFormat, downloadFileName, exportMimeType } from '../src/document-file'

describe('document file helpers', () => {
  it('detects supported formats without case sensitivity', () => {
    expect(detectDocumentFormat('보고서.HWPX')).toBe('hwpx')
    expect(detectDocumentFormat('legacy.hwp')).toBe('hwp')
    expect(detectDocumentFormat('memo.txt')).toBeUndefined()
  })

  it('keeps the original base name and changes only the format extension', () => {
    expect(downloadFileName('2026.회의록.hwpx', 'hwp')).toBe('2026.회의록.hwp')
    expect(downloadFileName('untitled', 'hwpx')).toBe('untitled.hwpx')
    expect(downloadFileName('', 'hwpx')).toBe('document.hwpx')
  })

  it('uses the expected download MIME type', () => {
    expect(exportMimeType('hwp')).toBe('application/x-hwp')
    expect(exportMimeType('hwpx')).toBe('application/vnd.hancom.hwpx')
  })
})
