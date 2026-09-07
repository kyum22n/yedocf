# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 알려진 제한사항

- **아이디/비밀번호 찾기, 이메일 인증**: 현재 화면은 남아있으나 기능은 비활성화되어 있습니다(SMTP 연동이 필요한 별도 작업이라 이번 배포 범위에서 제외). 포트폴리오 완성 후 추가 예정입니다.
- 무료 tier(Render/Neon) 특성상 일정 시간 미사용 시 첫 요청이 느릴 수 있습니다(콜드스타트).
