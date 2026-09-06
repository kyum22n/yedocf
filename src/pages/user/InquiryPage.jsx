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
import axios from "axios";

const InquiryPage = () => {

    // 상태 관리
    const [form, setForm] = useState({
        uName: "",
        uEmail: "",
        visit: false, // 초진 : false, 재진 : true
        qContent: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "visit" ? value === "true" : value, // visit이면 문자열을 boolean으로 변환
        }));
    };

    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 토큰 저장
        const token = sessionStorage.getItem("accessToken");
        const uId = sessionStorage.getItem("uId");

        if (!form.uName || !form.uEmail || !form.qContent) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post("/api/inquiry", {
                uId,
                uName: form.uName,
                uEmail: form.uEmail,
                visit: form.visit,
                qContent: form.qContent,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("작성하신 문의가 등록되었습니다.");
            setForm({ uName: "", uEmail: "", visit: false, qContent: "" });

        } catch (error) {
            console.error("문의 등록 실패", error);
            alert("로그인이 필요합니다.");

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
                            <label className="block font-medium mb-1">이름</label>
                            <input
                                type="text"
                                name="uName"
                                value={form.uName}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">이메일</label>
                            <input
                                type="text"
                                name="uEmail"
                                value={form.uEmail}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">방문 여부</label>
                            <div className="space-x-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="visit"
                                        value="false"
                                        checked={form.visit === false}
                                        onChange={handleChange}
                                    />{" "}
                                    초진
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="visit"
                                        value="true"
                                        checked={form.visit === true}
                                        onChange={handleChange}
                                    />{" "}
                                    재진
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">문의 내용</label>
                            <textarea
                                name="qContent"
                                value={form.qContent}
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