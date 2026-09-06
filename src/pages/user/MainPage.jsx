/**
 * packageName    : src.pages.user
 * fileName       : MainPage.jsx
 * author         : jkw
 * date           : 25.06.11
 * description    : 공지사항 및 이벤트 팝업 추가
 * ===========================================================
 */

import React from "react";
import PopupNotice from "../../components/PopupNotice";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DirectionsMap from '@/components/features/directions/DirectionsMap';
import GoToReservationButton from '@/components/common/GoToReservationButton';
import { background } from '@/assets/cdnImages';
import { lobby } from '@/assets/images/index';
import Footer from '@/components/layout/Footer';
import Spacer from '@/components/common/Spacer';

import Container from '@/components/layout/Container';
import IntroSection from '@/components/mainSection/IntroSection';
import DoctorSection from '@/components/mainSection/DoctorSection';
import ProcedureSection from "@/components/mainSection/ProcedureSection";
import ReviewSection from "@/components/mainSection/ReviewSection";


const MainPage = () => {
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollTarget = params.get("scrollTo");
    if (scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [search]);

  return (
    <>
      <PopupNotice />  {/* 추가 - 팝업 컴포넌트 */}

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white">

        {/* Hero Section */}
        <section
          id="hero"
          className="h-screen bg-cover bg-center flex items-center justify-center relative"
          style={{ backgroundImage: `url(${lobby})`, backgroundPositionY: '50%' }}
        >
          <video src={background} className="absolute inset-0 w-full h-full object-cover"
            autoPlay loop muted playsInline type="video/webm"></video>
          <div className="absolute bottom-[15%] flex flex-col items-center text-center gap-4">
            <p className="text-white text-lg font-[SeoulHangangM] text-shadow-lg">
              Beauty & Technology
            </p>
            <p className="text-white text-6xl font-[SeoulHangangM] text-shadow-lg">
              연세 BT 미래병원
            </p>
            <p className="text-white text-2xl font-[SeoulHangangM] text-shadow-lg">
              당신의 아름다움을 미래로 연결합니다.
            </p>
          </div>
          <div className="absolute bottom-[5%] flex flex-col items-center text-center gap-1 animate-bounce text-white">
            <p>Scroll Down</p>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
            </svg>
          </div>
        </section>
        <Spacer size='lg' />
        <Container>
          <IntroSection />
          <Spacer size='lg' />
          <DoctorSection />
          <Spacer size='lg' />
          <ProcedureSection />
          <Spacer size='lg' />
          <ReviewSection />
        </Container>


        <DirectionsMap />

        <Spacer size='lg' />
        <Footer />
        <GoToReservationButton />
      </div>
    </>
  );
};

export default MainPage;

