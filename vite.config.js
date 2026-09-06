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
    // TreatmentCategory/StaffSchedule/Statistics/Dashboard/Review)는
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
      // '/admin'은 백엔드 API 접두사이면서 동시에 프론트 라우트(/admin, /admin/*)이기도
      // 하므로, 이 앱이 실제로 쓰는 프론트 라우트로 들어오는 요청만 프록시에서 제외해
      // Vite의 SPA fallback(index.html)이 대신 응답하도록 한다.
      // 주의: 프록시 매칭은 문자열 접두사 비교라 '/adminlogin'처럼 '/admin'으로
      // *시작만* 하는 무관한 경로도 걸리므로, 실제로 '/admin' 세그먼트인 경우만
      // 백엔드 API 대상으로 취급한다.
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

          const frontendAdminRoutes = [
            '/admin',
            '/admin/reservations',
            '/admin/staff',
            '/admin/inquiry',
            '/admin/noticeManage',
            '/admin/consultations',
            '/admin/treatments',
            '/admin/staff-schedules',
            '/admin/statistics',
            '/admin/reviews',
          ];
          if (frontendAdminRoutes.includes(path)) {
            return req.url;
          }
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