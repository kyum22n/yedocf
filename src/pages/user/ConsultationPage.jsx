/**
 * packageName    : src.pages.user
 * fileName       : ConsultationPage.jsx
 * description    : 상담 신청 / 내 상담 조회·수정·취소 (Consultation 도메인)
 * ===========================================================
 */

import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import CalendarSelector from "@/components/features/reservation/CalendarSelector";
import TimeSelector from "@/components/features/reservation/TimeSelector";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import BannerSection from "@/components/common/BannerSection";
import Spacer from "@/components/common/Spacer";
import { banner4 } from '@/assets/cdnImages';
import { useUser } from "@/contexts/UserProvider";

const statusLabels = {
    RECEIVED: "접수",
    SCHEDULED: "상담 예정",
    COMPLETED: "상담 완료",
    CONVERTED: "예약으로 전환됨",
    CANCELED: "취소",
};

const ConsultationPage = () => {
    const { user } = useUser();

    if (user?.type === "admin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h2 className="text-2xl font-bold mb-4">사용자를 위한 기능입니다</h2>
                <p className="text-gray-600">이 상담 신청 페이지는 일반 사용자만 이용할 수 있습니다.</p>
                <button
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => window.history.back()}
                >
                    이전 페이지로
                </button>
            </div>
        );
    }

    const [treatments, setTreatments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [memo, setMemo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [myConsultations, setMyConsultations] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchMyConsultations = () => {
        const uId = sessionStorage.getItem("uId");
        axiosInstance.get("/consultations/member", { params: { uId } })
            .then((res) => setMyConsultations(res.data))
            .catch((error) => console.error("상담 내역 조회 실패", error));
    };

    useEffect(() => {
        axiosInstance.get("/treatments/all")
            .then((res) => setTreatments(res.data))
            .catch((error) => console.error("진료 항목 조회 실패", error));
        fetchMyConsultations();
    }, []);

    const treatmentName = (id) => treatments.find((t) => t.treatmentId === id)?.treatmentName ?? id;

    const resetForm = () => {
        setSelectedDate(null);
        setSelectedTime("");
        setSelectedItem("");
        setMemo("");
        setEditingId(null);
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime || !selectedItem) {
            alert("모든 항목을 선택해주세요.");
            return;
        }

        const uId = sessionStorage.getItem("uId");
        const data = {
            uId,
            treatmentId: Number(selectedItem),
            consultationMemo: memo,
            preferredDate: selectedDate.toLocaleDateString("sv-SE"),
            preferredTime: selectedTime,
        };

        try {
            setIsLoading(true);
            if (editingId) {
                await axiosInstance.put("/consultations/update", { ...data, consultationId: editingId });
                alert("상담 신청이 수정되었습니다.");
            } else {
                await axiosInstance.post("/consultations/register", data);
                alert("상담 신청이 완료되었습니다.");
            }
            resetForm();
            fetchMyConsultations();
        } catch (error) {
            console.error("상담 신청 실패:", error);
            alert(error.response?.data?.message || "상담 신청에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (c) => {
        setEditingId(c.consultationId);
        setSelectedDate(new Date(c.preferredDate));
        setSelectedTime(c.preferredTime);
        setSelectedItem(String(c.treatmentId));
        setMemo(c.consultationMemo || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancel = async (c) => {
        if (!window.confirm("이 상담 신청을 취소하시겠습니까?")) return;

        const uId = sessionStorage.getItem("uId");
        try {
            await axiosInstance.put("/consultations/cancel", { consultationId: c.consultationId, uId });
            fetchMyConsultations();
        } catch (error) {
            console.error("상담 취소 실패", error);
            alert("상담 취소에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-8">
            <BannerSection image={banner4} title="상담 신청" subtitle="" objectPosition="object-[50%_30%]" />
            <div className="relative z-20 bg-white">
                <Spacer />
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-6">
                    <div className="border rounded-lg p-4 flex-1 space-y-4">
                        <CalendarSelector
                            selectedDate={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                        />
                        <TimeSelector
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSelect={(time) => setSelectedTime(time)}
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <Dropdown
                            value={selectedItem}
                            onSelect={(e) => setSelectedItem(e.target.value)}
                            options={[
                                { value: "", label: "항목을 선택해주세요" },
                                ...treatments.map((t) => ({ value: String(t.treatmentId), label: t.treatmentName })),
                            ]}
                        />
                        <textarea
                            className="w-full border rounded p-2 h-24"
                            placeholder="상담 시 참고할 내용을 적어주세요 (선택)"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                size="lg"
                                disabled={isLoading || !selectedDate || !selectedTime || !selectedItem}
                            >
                                {isLoading ? "처리 중..." : editingId ? "수정하기" : "상담 신청하기"}
                            </Button>
                            {editingId && (
                                <Button variant="secondary" onClick={resetForm}>취소</Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 pb-10">
                    <h2 className="text-xl font-bold mb-4">내 상담 내역</h2>
                    <table className="w-full border border-gray-300 text-center text-sm">
                        <thead className="bg-pink-100 text-gray-800">
                            <tr>
                                <th className="p-2 border">진료 항목</th>
                                <th className="p-2 border">희망 날짜</th>
                                <th className="p-2 border">희망 시간</th>
                                <th className="p-2 border">상태</th>
                                <th className="p-2 border">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myConsultations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-gray-500">상담 신청 내역이 없습니다.</td>
                                </tr>
                            ) : (
                                myConsultations.map((c) => (
                                    <tr key={c.consultationId}>
                                        <td className="border p-2">{treatmentName(c.treatmentId)}</td>
                                        <td className="border p-2">{c.preferredDate}</td>
                                        <td className="border p-2">{c.preferredTime}</td>
                                        <td className="border p-2">{statusLabels[c.consultationStatus] ?? c.consultationStatus}</td>
                                        <td className="border p-2">
                                            {(c.consultationStatus === "RECEIVED" || c.consultationStatus === "SCHEDULED") && (
                                                <div className="flex gap-2 justify-center">
                                                    <Button variant="secondary" className="text-sm" onClick={() => handleEdit(c)}>수정</Button>
                                                    <Button variant="secondary" className="text-sm" onClick={() => handleCancel(c)}>취소</Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Spacer size="lg" />
            </div>
        </div>
    );
};

export default ConsultationPage;
