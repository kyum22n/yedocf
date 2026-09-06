import React, { useEffect, useState } from "react";
import originAxios from "axios";

const publicAxios = originAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const PopupNotice = () => {
  const [popupNotices, setPopupNotices] = useState([]);
//   const [openPopups, setOpenPopups] = useState([]);
  const [checkedPopups, setCheckedPopups] = useState({});

  // localStorage에서 닫기 설정 확인
  const getHiddenPopups = () => {
    const hidden = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
    const today = new Date().toISOString().split('T')[0];
    return Object.keys(hidden).filter(id => hidden[id] === today);
  };

  // 팝업 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicAxios.get(`/api/noticeEvent`);
        const hiddenIds = getHiddenPopups();

        const popupItems = response.data.filter(
          item => !hiddenIds.includes(String(item.neId))
        );

        setPopupNotices(popupItems);
        // setOpenPopups(popupItems.map(item => item.neId));
      } catch (error) {
        console.error("팝업 데이터 조회 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (popupId) => (e) => {
    setCheckedPopups(prev => ({
      ...prev,
      [popupId]: e.target.checked
    }));

    if(e.target.checked) handleClosePopup(popupId);
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = (popupId) => {
    if (!checkedPopups[popupId]) {
      const today = new Date().toISOString().split('T')[0];
      const hidden = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
      localStorage.setItem('hiddenPopups', JSON.stringify({
        ...hidden,
        [popupId]: today
      }));

      setPopupNotices(prev => prev.filter(notice => notice.neId !== popupId));
    }
    // setOpenPopups(prev => prev.filter(id => id !== popupId));
  };

  if (!popupNotices.length) return null;

  return (
    <>
      {popupNotices.map((notice, index) => {
        // const notice = popupNotices.find(item => item.neId === popupId);
        // 팝업 위치 계산: index에 따라 top, left 값 조정
        const top = '50%';
        const left = notice.neType === '이벤트' ? '20%' : '80%';

        return (
          <div 
            key={notice.neId}
            className="popup"
            style={{
              position: 'fixed',
              top: top,
              left: left,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              background: 'white',
              padding: '20px',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              Width: '400px',
              minWidth: '400px',
              maxWidth: '400px',
            }}
          >
            <img 
              src={notice.neImageUrl} 
              style={{ 
                width: "100%", 
                display: 'block', 
                margin: '10px 0',
                objectFit: 'contain'
              }}
              alt="팝업 이미지"
            />
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
              <input
                type="checkbox"
                id={`checkbox-${notice.neId}`}
                checked={checkedPopups[notice.neId] || false}
                onChange={handleCheckboxChange(notice.neId)}
                style={{ marginRight: '8px' }}
              />
              <label 
                htmlFor={`checkbox-${notice.neId}`}
                style={{ fontSize: '14px', cursor: 'pointer' }}
              >
                오늘 하루 이 창을 열지 않음
              </label>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PopupNotice;