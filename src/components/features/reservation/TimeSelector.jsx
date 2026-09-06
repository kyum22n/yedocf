import React from "react";

const rawWeekdayHours = [
  "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const rawSaturdayHours = [
  "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30"
];

// 🔍 요일별 시간 옵션 가져오기
const getTimeSlotsByDay = (date) => {
  const day = new Date(date).getDay(); // 0 = 일, 6 = 토

  if (day === 0) return []; // 일요일은 예약 불가
  const rawTimes = day === 6 ? rawSaturdayHours : rawWeekdayHours;

  return rawTimes.map(time => ({
    display: time,
    value: `${time}:00`, // 전송용 format
  }));
};

const TimeSelector = ({ selectedDate, selectedTime, onSelect, disabledTimes = [] }) => {
  if (!selectedDate) {
    return (
      <p className="text-center text-gray-500 text-sm">
        먼저 날짜를 선택해주세요. <br /> 당일 예약은 전화문의 바랍니다.
      </p>
    );
  }

  const slots = getTimeSlotsByDay(selectedDate);

  if (slots.length === 0) {
    return (
      <p className="text-center text-red-500 text-sm">
        일요일은 예약이 불가능합니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map(({ value, display }) => {
        const isDisabled = disabledTimes.includes(value); 
        const isSelected = selectedTime === value;

        return (
          <button
            key={value}
            onClick={() => !isDisabled && onSelect(value)}
            className={`px-3 py-2 border rounded transition-all
        ${isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-400"}
        ${isSelected ? "bg-black text-white" : ""}`}
            disabled={isDisabled}
          >
            {display}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSelector;
