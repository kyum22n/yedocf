import { useState, useEffect } from "react";
import CalendarSelector from "@/components/features/reservation/CalendarSelector";
import TimeSelector from "@/components/features/reservation/TimeSelector";
import axiosInstance from "@/api/axiosInstance";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import BannerSection from "@/components/common/BannerSection";
import Spacer from "@/components/common/Spacer";
import { banner4 } from '@/assets/cdnImages';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@/contexts/UserProvider";

const ReservationPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [treatments, setTreatments] = useState([]);

    const { user } = useUser();
    const navigate = useNavigate();

        // 관리자 접근 차단 (예약)
    if (user?.type === "admin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h2 className="text-2xl font-bold mb-4">사용자를 위한 기능입니다</h2>
                <p className="text-gray-600">이 예약 페이지는 일반 사용자만 이용할 수 있습니다.</p>
                <button
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => window.history.back()}
                >
                    이전 페이지로
                </button>
            </div>
        );
    }

    // 노출 진료 항목 조회
    useEffect(() => {
        axiosInstance
            .get("/api/treatments")
            .then((res) => setTreatments(res.data))
            .catch((err) => console.error("진료 항목 조회 실패:", err));
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const uId = sessionStorage.getItem('uId');

        if (!token || !uId || token === "null") {
            alert("로그인이 필요합니다. 다시 로그인해주세요.");
            navigate('/login');
            return;
        }

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split("T")[0];

            axiosInstance
                .get(`/api/reserve/disabled-times`, {
                    params: { consultDate: dateStr },
                })
                .then((res) => {
                    const trimmed = res.data.map(time => time.slice(0, 5));
                    setDisabledTimes(trimmed);
                })
                .catch((err) => {
                    console.error("예약된 시간 조회 실패:", err);
                });
        } else {
            setDisabledTimes([]);
        }
    }, [selectedDate, navigate]);

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime || !selectedItem) {
            alert("모든 항목을 선택해주세요.");
            return;
        }

        const uId = sessionStorage.getItem('uId');

        const selectedTreatment = treatments.find(
            (t) => String(t.treatmentId) === selectedItem
        );

        const data = {
            uId,
            tName: selectedTreatment?.tName,
            consultDate: selectedDate.toLocaleDateString("sv-SE"),
            consultTime: selectedTime,
            status: "대기",
        };

        try {
            setIsLoading(true);
            await axiosInstance.post("/api/reserve", data);
            alert("예약이 완료되었습니다. 마이페이지로 이동합니다.");
            setSelectedDate(null);
            setSelectedTime("");
            setSelectedItem("");

            navigate("/mypage");
        } catch (error) {
            console.error("예약 실패:", error);
            alert("예약에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <BannerSection image={banner4} title="상담 예약" subtitle="" objectPosition="object-[50%_30%]" />
            <div className="relative z-20 bg-white">
                <Spacer />
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-6">
                    {/* 날짜/시간 선택 */}
                    <div className="border rounded-lg p-4 flex-1 space-y-4">
                        <CalendarSelector
                            selectedDate={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                        />
                        <TimeSelector
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSelect={(time) => setSelectedTime(time)}
                            disabledTimes={disabledTimes}
                        />
                    </div>

                    {/* 예약 항목 선택 */}
                    <div className="flex-1 flex flex-col gap-4">
                        <Dropdown
                            value={selectedItem}
                            onSelect={(e) => setSelectedItem(e.target.value)}
                            options={[
                                { value: "", label: "항목을 선택해주세요" },
                                ...treatments.map((t) => ({
                                    value: String(t.treatmentId),
                                    label: t.tName,
                                })),
                            ]}
                        />

                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            size="lg"
                            className="mt-4"
                            disabled={isLoading || !selectedDate || !selectedTime || !selectedItem}
                        >
                            {isLoading ? "예약 중..." : "예약하기"}
                        </Button>
                    </div>
                </div>
                <Spacer size="lg" />
            </div>
        </div>
    );
};

export default ReservationPage;
