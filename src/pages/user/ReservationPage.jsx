import { useState, useEffect } from "react";
import CalendarSelector from "@/components/features/reservation/CalendarSelector";
import TimeSelector from "@/components/features/reservation/TimeSelector";
import axios from "axios";
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

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const uId = sessionStorage.getItem('uId');

        if (!token || !uId || token === "null") {
            alert("로그인이 필요합니다. 다시 로그인해주세요.");
            console.error("토큰 또는 uId 없음");
            navigate('/login');
            return;
        }

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split("T")[0];

            console.log("보내는 토큰:", token);
            axios
                .get(`/api/reserve/disabled-times`, {
                    params: { consultDate: dateStr },
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // },
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
        console.log("예약 버튼 클릭됨");

        if (!selectedDate || !selectedTime || !selectedItem) {
            alert("모든 항목을 선택해주세요.");
            console.warn("⚠️ 선택되지 않은 항목 있음:", {
                selectedDate,
                selectedTime,
                selectedItem,
            });
            return;
        }

        const token = sessionStorage.getItem('accessToken');
        const uId = sessionStorage.getItem('uId');

        console.log("accessToken:\n" + token);

        console.log("로컬스토리지 값:", { token, uId });

        const itemMap = {
            nose1: "콧대 성형",
            nose2: "매부리코 성형",
            nose3: "복코 교정",
            nose4: "코끝 성형",
            nose5: "콧볼 축소",
            eye1: "쌍커풀 수술",
            eye2: "비절개 쌍커풀 수술",
            eye3: "앞트임 수술",
            eye4: "뒤트임 수술",
            eye5: "밑트임 수술",
            eye6: "눈매 교정 수술",
            eye7: "지방 재배치 수술",
            eye8: "다크서클 제거",
            chin1: "광대축소 수술",
            chin2: "사각턱 수술",
            chin3: "V라인 턱끝 성형수술",
            chin4: "양악수술",
            chin5: "이중턱 지방흡입",
        };

        const data = {
            uId,
            tName: itemMap[selectedItem],
            consultDate: selectedDate.toLocaleDateString("sv-SE"),
            consultTime: selectedTime,
            status: "대기",
        };

        console.log("서버로 전송할 예약 데이터:", data);

        try {
            setIsLoading(true);
            const response = await axios.post(
                "/api/reserve",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("예약이 완료되었습니다. 마이페이지로 이동합니다.");
            console.log("예약 성공:", response.data);
            setSelectedDate(null);
            setSelectedTime("");
            setSelectedItem("");

            navigate("/mypage");
        } catch (error) {
            console.error("예약 실패:", error);
            console.log("error.response:", error.response);
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
                            onChange={(date) => {
                                console.log("날짜 선택됨:", date);
                                setSelectedDate(date);
                            }}
                        />
                        <TimeSelector
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSelect={(time) => {
                                console.log("시간 선택됨:", time);
                                setSelectedTime(time);
                            }}
                            disabledTimes={disabledTimes}
                        />
                    </div>

                    {/* 예약 항목 선택 */}
                    <div className="flex-1 flex flex-col gap-4">
                        <Dropdown
                            value={selectedItem}
                            onSelect={(e) => {
                                console.log("항목 선택됨:", e.target.value);
                                setSelectedItem(e.target.value);
                            }}
                            options={[
                                { value: "", label: "항목을 선택해주세요" },
                                { value: "", label: "코 수술" },
                                { value: "nose1", label: "콧대 성형" },
                                { value: "nose2", label: "매부리코 성형" },
                                { value: "nose3", label: "복코 교정" },
                                { value: "nose4", label: "코끝 성형" },
                                { value: "nose5", label: "콧볼 축소" },
                                { value: "", label: "눈 수술" },
                                { value: "eye1", label: "쌍커풀 수술" },
                                { value: "eye2", label: "비절개 쌍커풀 수술" },
                                { value: "eye3", label: "앞트임 수술" },
                                { value: "eye4", label: "뒤트임 수술" },
                                { value: "eye5", label: "밑트임 수술" },
                                { value: "eye6", label: "눈매 교정 수술" },
                                { value: "eye7", label: "지방 재배치 수술" },
                                { value: "eye8", label: "다크서클 제거" },
                                { value: "", label: "윤곽 수술" },
                                { value: "chin1", label: "광대축소 수술" },
                                { value: "chin2", label: "사각턱 수술" },
                                { value: "chin3", label: "V라인 턱끝 성형수술" },
                                { value: "chin4", label: "양악수술" },
                                { value: "chin5", label: "이중턱 지방흡입" },
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
