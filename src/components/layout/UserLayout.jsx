/**
 * packageName    : src.pages
 * fileName       : App.jsx
 * author         : lkm
 * date           : 25.06.15
 * description    : (수정)1:1 문의 탭 추가
 * ===========================================================
 */

import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from "react-router-dom";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import LoginPage from '@/pages/user/LoginPage';
import SignupPage from '@/pages/user/SignupPage';
import MainPage from '@/pages/user/MainPage';
import EyePage from '@/pages/user/EyePage';
import NosePage from '@/pages/user/NosePage';
import FacePage from '@/pages/user/FacePage';
import MyPage from '@/pages/user/MyPage';
import FindAccountPage from '@/pages/user/FindAccountPage';
import ReservationPage from '@/pages/user/ReservationPage';
import NoticeEventPage from '@/pages/user/NoticeEventPage';
import InquiryPage from '@/pages/user/InquiryPage';
import ConsultationPage from '@/pages/user/ConsultationPage';
import ReviewPage from '@/pages/user/ReviewPage';

const UserLayout = () => {
  const location = useLocation();
  const hideFooterPaths = ["/"]; // MainPage 등

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      {/* 로그인 여부는 Header 내부에서 localStorage 등으로 판단 */}
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/idpwfind" element={<FindAccountPage />} />
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
        <Route path="/eye" element={<EyePage />} />
        <Route path="/nose" element={<NosePage />} />
        <Route path="/face" element={<FacePage />} />
        <Route path="/notice" element={<NoticeEventPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/consultation" element={<ProtectedRoute><ConsultationPage /></ProtectedRoute>} />
        {/* 계약상 GET /reviews/**는 공개 조회를 의도하지만 SecurityConfig가 아직 갱신되지
            않아 실제로는 인증이 필요하다(docs/api-contract.md §13 참고) — 백엔드가
            permitAll로 열어주면 ProtectedRoute를 제거할 것 */}
        <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default UserLayout;
