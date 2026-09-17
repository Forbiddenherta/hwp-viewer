# Phase 0 — rhwp 평가 기록

작성일: 2026-09-17

## 결론

1차 MVP의 편집 엔진은 `@rhwp/editor`를 사용한다. 패키지는 Rust/WASM 기반의 전체 편집기를 iframe으로 제공하며, 공식 문서에 텍스트 편집, undo/redo, 글자·문단 서식 및 표 편집을 명시한다.

## 확인한 항목

| 요구사항 | 결과 | 근거 |
| --- | --- | --- |
| 웹에서 동작 | 충족 | `createEditor()`를 웹 페이지에 임베드하는 API 제공 |
| HWP/HWPX 열기·편집 | 충족(라이브러리 주장, 앱에서 스파이크 필요) | 전체 편집기 패키지와 웹 편집 기능 문서화 |
| undo/redo | 충족(라이브러리 주장) | rhwp README의 Web Editor 기능 목록 |
| HWP/HWPX 내보내기 | 충족 | `exportHwp()`, `exportHwpx()`가 `Uint8Array` 반환 |
| PDF 내보내기 | 추가 검증 필요 | PDF 내보내기는 공식 README에서 네이티브 CLI 경로가 명시됨. 브라우저 임베드 API 지원 여부는 별도 확인 필요 |
| 라이선스 | 충족 | rhwp 저장소의 MIT License (Copyright 2025–2026 Edward Kim) |

## 채택 이유

직접 HWPX 직렬화와 HWP OLE 레코드 파서를 구현하면 핵심 기능(수정, undo/redo, 저장)에 시간이 크게 든다. `@rhwp/editor`는 그 기능을 완성된 UI와 함께 제공하므로, 앱은 파일 처리 UX와 개인정보 보호, 브랜딩에 집중할 수 있다.

## 남은 검증

- 실제 HWPX 파일로 열기 → 텍스트 수정 → HWPX 다운로드 → 재열기 왕복 테스트
- HWP 파일에도 동일한 저장 흐름이 동작하는지 확인
- 브라우저 환경에서 PDF 내보내기 가능 여부와 대체 전략 결정
- 표·이미지가 포함된 실제 파일 3~5개로 호환성 확인

## 구현 스파이크

- Vite + TypeScript 앱을 생성하고 `@rhwp/editor` 0.8.6을 설치했다.
- `createEditor()`로 iframe을 마운트하고, `loadFile()` 및 `exportHwpx()`의 타입 선언을 확인했다.
- 앱의 파일 선택 UI는 `loadFile(ArrayBuffer, filename)`을, 저장 버튼은 `exportHwpx()`를 호출한다.
- 실제 문서 파일이 아직 제공되지 않아 왕복 테스트는 보류한다.

## 출처

- https://github.com/edwardkim/rhwp/blob/main/README_EN.md
- https://github.com/edwardkim/rhwp/wiki/Export-API-%EC%82%AC%EC%9A%A9-%EA%B0%80%EC%9D%B4%EB%93%9C
- https://github.com/edwardkim/rhwp/blob/main/LICENSE
