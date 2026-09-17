# 한글 문서 편집기

광고 없이 브라우저에서 HWP/HWPX 문서를 열고 편집하는 개인용 웹 앱입니다.

## 현재 상태

`@rhwp/editor` 임베드 방식으로 HWP/HWPX 읽기·편집·저장 기능을 제공합니다. 파일을 열면 원래 파일명을 유지해 HWP 또는 HWPX로 저장할 수 있습니다. 이 앱은 별도 서버로 파일을 업로드하지 않습니다.

## 실행

```bash
npm install
npm run dev
npm test
```

공개 배포 준비는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 주의

- HWP, HWPX, 한글 및 한컴은 한글과컴퓨터의 등록 상표입니다. 이 프로젝트는 한글과컴퓨터와 무관한 독립 개인 프로젝트입니다.
- `rhwp`는 MIT 라이선스를 따릅니다. 배포 전 라이선스 고지를 포함해야 합니다.
- 기본 편집기는 rhwp의 공식 Studio를 iframe으로 불러옵니다. 완전히 자체 호스팅하려면 `VITE_RHWP_STUDIO_URL` 환경 변수에 자체 Studio 주소를 지정하세요.
