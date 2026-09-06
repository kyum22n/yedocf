/**
 * packageName    : src.pages.user
 * fileName       : InquiryPage.jsx
 * author         : lkm
 * date           : 25.06.13
 * description    : 사용자 1:1 문의 페이지
 * ===========================================================
 */

import BannerSection from '@/components/common/BannerSection';
import DirectionsMap from '@/components/features/directions/DirectionsMap';
import Spacer from '@/components/common/Spacer';
import { banner5 } from '@/assets/cdnImages';
import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const INQUIRY_TYPES = [
    { value: "RESERVATION", label: "예약 문의" },
    { value: "TREATMENT", label: "진료 문의" },
    { value: "PAYMENT", label: "결제 문의" },
    { value: "ETC", label: "기타" },
];

const InquiryPage = () => {

    // 상태 관리
    const [form, setForm] = useState({
        inquiryType: "RESERVATION",
        title: "",
        content: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const uId = sessionStorage.getItem("uId");

        if (!form.title || !form.content) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axiosInstance.post("/inquiries/register", {
                uId,
                inquiryType: form.inquiryType,
                title: form.title,
                content: form.content,
            });

            alert("작성하신 문의가 등록되었습니다.");
            setForm({ inquiryType: "RESERVATION", title: "", content: "" });

        } catch (error) {
            console.error("문의 등록 실패", error);
            alert("문의 등록에 실패했습니다. 로그인이 필요합니다.");

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <BannerSection
                title="1:1 문의"
                image={banner5}
                objectPosition="object-[50%_40%]"
            />
            <div className="relative z-20 bg-white">
                <Spacer size="lg" />

                <div className="max-w-2xl z-20 mx-auto space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">문의 유형</label>
                            <select
                                name="inquiryType"
                                value={form.inquiryType}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                            >
                                {INQUIRY_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">제목</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">문의 내용</label>
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                className="w-full border rounded p-2 h-32"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            문의 등록
                        </button>
                    </form>
                </div>
                <Spacer size="lg" />

                <DirectionsMap />
            </div>

        </>
    );
};

export default InquiryPage;
