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
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/eye" element={<EyePage />} />
        <Route path="/nose" element={<NosePage />} />
        <Route path="/face" element={<FacePage />} />
        <Route path="/notice" element={<NoticeEventPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default UserLayout;
