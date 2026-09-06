/**
 * packageName    : src.components.common
 * fileName       : NoticeEventCard.jsx
 * author         : jkw
 * date           : 25.06.11
 * description    : 공지사항 및 이벤트 관리자/사용자 공통 컴포넌트
 * ===========================================================
 */

import React from "react";

const NoticeEventCard = ({ item }) => {
  return (
    <div className="border rounded-lg shadow p-4 mb-4">
      <div className="flex items-baseline justify-between h-10 mb-4">
        <h3 className="font-bold text-xl mb-2">{item.neTitle} </h3>
        <span className="text-gray-500">{item.neType}</span>
      </div>
      <p className="text-gray-700 mb-2">{item.neContent}</p>
      {item.neImageUrl && (
        <img
          src={item.neImageUrl}
          alt={item.neTitle}
          className="max-h-64 mx-auto my-2 rounded"
        />
      )}
      {item.neType === "EVENT" && item.neStartDate && item.neEndDate && (
        <p className="text-sm text-gray-500">
          이벤트 기간: {item.neStartDate} ~ {item.neEndDate}
        </p>
      )}
    </div>
  );
};

export default NoticeEventCard;
