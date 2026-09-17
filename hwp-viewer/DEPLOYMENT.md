# 공개 배포 준비

이 프로젝트는 정적 웹 앱이므로 Netlify에서 Git 저장소를 연결한 뒤 배포할 수 있다.

1. GitHub 등에 이 폴더를 저장소로 올린다.
2. Netlify에서 해당 저장소를 선택한다.
3. 빌드 명령은 `npm run build`, 배포 폴더는 `dist`로 설정한다. `netlify.toml`에도 같은 설정이 들어 있다.
4. 배포가 끝나면 Netlify가 공개 HTTPS 주소를 제공한다.

## 개인정보 및 rhwp Studio

기본값은 rhwp의 공식 Studio 주소를 iframe으로 사용한다. 우리 앱은 별도 서버로 문서를 업로드하지 않지만, 문서 바이트는 그 iframe에서 처리된다.

완전히 자체 호스팅하려면 rhwp Studio를 별도 배포한 뒤, 배포 환경 변수 `VITE_RHWP_STUDIO_URL`에 그 Studio의 HTTPS 주소를 넣는다. `@rhwp/editor`는 HTTP(S) 주소만 지원한다.
