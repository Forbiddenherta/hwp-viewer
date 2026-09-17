# 프로젝트 진행 기록

원본 요구사항 문서: `C:\Users\apost\Downloads\HWP_VIEWER_PROJECT.md`

이 작업 폴더에는 원본 문서를 복제하지 않고, 작업 결과와 결정만 기록합니다.

## 진행 상황 로그

- 2026-09-17 — Phase 0 시작: `rhwp`/`@rhwp/editor`의 웹 임베드, HWP/HWPX 내보내기 API, MIT 라이선스를 조사했다. 1차 MVP는 옵션 A(`@rhwp/editor` 사용)로 진행한다. Vite 기반 웹 앱을 만들고 로컬 HWP/HWPX 파일 선택 및 HWPX 다운로드 UI를 연결했다. 실제 HWPX 샘플이 없어 왕복 테스트와 PDF 브라우저 내보내기 지원 여부는 보류했다.
- 2026-09-17 — 개발 서버에서 rhwp 의존성 사전 번들링이 실패하던 문제를 수정했다. `http://127.0.0.1:5173/` 응답(HTTP 200)을 확인했다.
- 2026-09-17 — 저장 기능을 확장했다. 원래 파일 이름을 유지하고 HWP/HWPX를 선택해 저장할 수 있으며, 저장 완료 후 rhwp에 저장 상태를 알린다. `tests/document-file.test.ts`의 파일명·형식·MIME type 테스트 3개와 `npm run build`를 통과했다. `netlify.toml`과 `DEPLOYMENT.md`로 공개 배포 준비를 추가했다. 실제 배포, 자체 rhwp Studio 호스팅, 실제 표·이미지 문서 왕복 테스트는 아직 실행하지 않았다.
