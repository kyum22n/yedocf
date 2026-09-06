const weekdayHours = [
    "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
];

const saturdayHours = [
    "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30"
];

const getTimeSlotsByDay = (date) => {
    const day = new Date(date).getDay(); // 0 = 일요일, 6 = 토요일
    if (day === 0) return [];
    return day === 6 ? saturdayHours : weekdayHours;
};

const TimeSelectorSelect = ({
    selectedDate,
    selectedTime,
    onSelect,
    disabledTimes = [],
    labelHidden = false,
    className = "",
}) => {
    if (!selectedDate) {
        return (
            <p className="text-sm text-gray-500 text-center mt-2">날짜를 먼저 선택해주세요.</p>
        );
    }

    const day = new Date(selectedDate).getDay();
    if (day === 0) {
        return <p className="text-red-500 text-sm mt-2">※ 일요일은 예약할 수 없습니다.</p>;
    }

    const timeSlots = getTimeSlotsByDay(selectedDate);

    const isPastTime = (dateStr, timeStr) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const slotTime = new Date(dateStr);
        slotTime.setHours(hour, minute, 0, 0);

        const now = new Date();
        return slotTime < now;
    };

    return (
        <div className="flex flex-col gap-1 p-2">
            {!labelHidden && (
                <label className="text-sm font-medium text-gray-700">시간대 선택</label>
            )}
            <select
                value={selectedTime}
                onChange={(e) => onSelect(e.target.value)}
                className={`border border-gray-300 rounded-md h-12 text-m pr-2 bg-white ${className}`}
            >
                <option value="">시간대를 선택하세요</option>
                {timeSlots.map((time) => {
                    const disabled =
                        disabledTimes.includes(time) || isPastTime(selectedDate, time);

                    return (
                        <option
                            key={time}
                            value={time}
                            disabled={disabled}
                        >
                            {time} {disabled && isPastTime(selectedDate, time) ? "(마감)" : ""}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default TimeSelectorSelect;
