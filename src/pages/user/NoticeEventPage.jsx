/**
 * packageName    : src.pages.user
 * fileName       : NoticeEventPage.jsx
 * author         : jkw
 * date           : 25.06.11
 * description    : 공지사항 및 이벤트 사용자 페이지
 * ===========================================================
 */

import React, { useEffect, useState } from "react";

import { getAllNoticeEvents, getNoticeEventByIdUser } from "@/api/noticeEvent";
import BannerSection from "@/components/common/BannerSection";
import { banner7 } from '@/assets/cdnImages'; // 배너 이미지 경로
import NoticeEventCard from "@/components/common/NoticeEventCard";
import Modal from "@/components/common/Modal";

// import { formatDate } from "@/constants/dateUtils";
import DirectionsMap from "@/components/features/directions/DirectionsMap";
import Spacer from "@/components/common/Spacer";


const NoticeEventPage = () => {
  const [noticeEvents, setNoticeEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllNoticeEvents();
        setNoticeEvents(response);
      } catch (error) {
        console.error("공지사항 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  // 상세 조회
  useEffect(() => {
    if (selectedId !== null) {
      const fetchDetail = async () => {
        try {
          const data = await getNoticeEventByIdUser(selectedId);
          setSelectedItem(data);

        } catch (error) {
          console.error("상세 데이터를 불러오는 중 오류 발생", error);
        }
      };
      fetchDetail();
    }
  }, [selectedId]);

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedId(null);
    setSelectedItem(null);
  };

  return (

    <>
       <BannerSection
        title="공지사항 / 이벤트"
        image={banner7}
        objectPosition="object-[50%_55%]"
      />

      <div className="relative z-20 bg-white">
        <Spacer size="lg" />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {noticeEvents.map(item => (
            <div key={item.neId} onClick={() => setSelectedId(item.neId)} className="cursor-pointer">
              <NoticeEventCard item={item} />
          </div>
          ))}
        </div>
        <DirectionsMap />
        <Spacer size="lg" />
      </div>

      {/* 모달 영역 */}
      {selectedItem && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <div className="flex flex-col items-center text-center">

            <h2 className="text-xl font-bold mb-2">{selectedItem.neTitle}</h2>

            {selectedItem.neImageUrl && (
              <img
                src={selectedItem.neImageUrl}
                alt={selectedItem.neTitle}
                className="w-full max-w-md mx-auto my-4"
              />
            )}

            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: selectedItem.neContent?.trim() || "<p>내용이 없습니다.</p>"
              }}
            />

          </div>
        </Modal>
      )}


    </>

  );

};

export default NoticeEventPage;