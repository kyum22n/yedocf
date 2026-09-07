import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    // 확정된 docs/api-contract.md 기준: User 도메인만 /api 접두사를 쓰고,
    // 나머지(Reservation/Notice/Inquiry/Admin/Consultation/Treatment/
    // TreatmentCategory/Statistics/Dashboard/Review)는
    // 접두사 없이 루트 경로를 그대로 쓰므로 전부 프록시 대상에 포함한다.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/reservations': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // '/admin'은 백엔드 API 접두사이면서 동시에 프론트 라우트 트리(/admin, /admin/*)이기도
      // 하다. 심지어 '/admin/dashboard'처럼 프론트 라우트와 백엔드 API 경로가 문자열이
      // 완전히 같은 경우도 있어(Dashboard 도메인), 경로만으로는 구분이 불가능하다.
      // 그래서 요청이 "브라우저가 페이지를 열려는 문서 탐색"인지 "axios가 데이터를
      // 가져오는 API 호출"인지를 헤더로 구분한다 — 문서 탐색이면 Vite의 SPA
      // fallback(index.html)이 응답하도록 프록시를 건너뛰고, 그 외(API 호출)는 백엔드로
      // 프록시한다. ('/adminlogin'처럼 '/admin'으로 시작만 하는 무관한 경로도 이 프록시
      // 컨텍스트에 걸리므로 먼저 걸러낸다.)
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass(req) {
          const path = req.url.split('?')[0];
          const isAdminSegment = path === '/admin' || path.startsWith('/admin/');
          if (!isAdminSegment) {
            return req.url; // 예: /adminlogin — 백엔드 API가 아님
          }

          const accept = req.headers['accept'] || '';
          const isBrowserNavigation =
            req.headers['sec-fetch-mode'] === 'navigate' || accept.includes('text/html');
          if (isBrowserNavigation) {
            return req.url; // 브라우저 주소창/새로고침 등 페이지 탐색 — SPA fallback에 맡긴다
          }
          // 그 외는 axios 등 API 호출 — 프록시 진행(undefined 반환)
        },
      },
      '/notices': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/inquiries': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/consultations': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/treatments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/treatment-categories': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/reviews': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});