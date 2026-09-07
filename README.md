# yedocf

병원(피부/성형 클리닉) 예약 서비스의 프론트엔드. 팀 프로젝트 원본(`kyum2n/yedocf`)을 기반으로 화면을 정리하고,
백엔드([`kyum22n/yedocb`](https://github.com/kyum22n/yedocb))의 확장된 도메인(상담/진료항목/통계/리뷰)에 맞춰
신규 화면을 추가한 개인 포트폴리오 프로젝트입니다.

- **라이브**: https://yedocf.vercel.app
- **백엔드 저장소**: [`kyum22n/yedocb`](https://github.com/kyum22n/yedocb)

## 기술 스택

- React + Vite, React Router, Tailwind CSS
- axios (단일 클라이언트, JWT 토큰 자동 첨부)
- Vitest + React Testing Library
- 배포: [Vercel](https://vercel.com)

## 주요 화면

- **사용자**: 메인/공지·이벤트/이용후기/1:1 문의/상담신청/예약/마이페이지, Google·Kakao 소셜 로그인
- **관리자**: 회원/예약/상담/진료항목·카테고리/공지/문의/리뷰 관리, 통계 대시보드

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:5173, /api 등 백엔드 프록시는 vite.config.js 참고
npm run build
npm test         # Vitest
```

## 배포

AWS EC2 + nginx 정적 서빙을 **Vercel**로 전환했습니다. SPA 라우팅(`vercel.json`), 환경변수(OAuth client id/redirect uri,
API base URL 등) 구성과 전환 과정의 트러블슈팅은 백엔드 저장소의
[`docs/deployment-migration.md`](https://github.com/kyum22n/yedocb/blob/main/docs/deployment-migration.md)에 기록되어 있습니다.

## 알려진 제한사항

- **아이디/비밀번호 찾기, 이메일 인증**: 현재 화면은 남아있으나 기능은 비활성화되어 있습니다(SMTP 연동이 필요한 별도 작업이라 이번 배포 범위에서 제외). 포트폴리오 완성 후 추가 예정입니다.
- 무료 tier(Render/Neon) 특성상 일정 시간 미사용 시 첫 요청이 느릴 수 있습니다(콜드스타트).
