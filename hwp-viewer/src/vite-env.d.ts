/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 직접 호스팅한 rhwp Studio 주소. 비워 두면 rhwp의 공식 Studio를 사용한다. */
  readonly VITE_RHWP_STUDIO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
