/**
 * packageName    : src.pages.user
 * fileName       : ReviewPage.jsx
 * description    : 리뷰 작성 / 목록 (Review 도메인 - 사용자)
 * ===========================================================
 */

import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import BannerSection from "@/components/common/BannerSection";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import { formatDateTime } from "@/constants/dateUtils";
import { banner7 } from '@/assets/cdnImages';
import { useUser } from "@/contexts/UserProvider";

const ReviewPage = () => {
    const { user } = useUser();
    const myUId = sessionStorage.getItem("uId");

    const [reviews, setReviews] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [filterTreatmentId, setFilterTreatmentId] = useState("");

    const fetchReviews = () => {
        const request = filterTreatmentId
            ? axiosInstance.get("/reviews/treatment", { params: { treatmentId: filterTreatmentId } })
            : axiosInstance.get("/reviews/all");

        request
            .then((res) => setReviews(res.data))
            .catch((error) => console.error("리뷰 목록 조회 실패", error));
    };

    useEffect(() => {
        axiosInstance.get("/treatments/all")
            .then((res) => setTreatments(res.data))
            .catch((error) => console.error("진료 항목 조회 실패", error));
    }, []);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterTreatmentId]);

    const treatmentName = (id) => treatments.find((t) => t.treatmentId === id)?.treatmentName ?? id;

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [form, setForm] = useState({ reviewId: null, treatmentId: "", title: "", content: "", imageUrl: "", hashTag: "" });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const openCreate = () => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (user.type === "admin") {
            alert("일반 사용자만 리뷰를 작성할 수 있습니다.");
            return;
        }
        setForm({ reviewId: null, treatmentId: treatments[0] ? String(treatments[0].treatmentId) : "", title: "", content: "", imageUrl: "", hashTag: "" });
        setIsWriteModalOpen(true);
    };

    const openEdit = (r) => {
        setForm({
            reviewId: r.reviewId,
            treatmentId: String(r.treatmentId),
            title: r.title,
            content: r.content,
            imageUrl: r.imageUrl || "",
            hashTag: r.hashTag || "",
        });
        setIsWriteModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.treatmentId || !form.title || !form.content) {
            alert("진료 항목, 제목, 내용을 모두 입력해주세요.");
            return;
        }

        const payload = {
            treatmentId: Number(form.treatmentId),
            title: form.title,
            content: form.content,
            imageUrl: form.imageUrl,
            hashTag: form.hashTag,
        };

        try {
            if (form.reviewId) {
                await axiosInstance.put("/reviews/update", { ...payload, reviewId: form.reviewId });
            } else {
                await axiosInstance.post("/reviews/register", payload);
            }
            fetchReviews();
            setIsWriteModalOpen(false);
        } catch (error) {
            console.error("리뷰 저장 실패", error);
            alert(error.response?.data?.message || "저장에 실패했습니다.");
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete("/reviews/delete", { params: { reviewId: selectedReview.reviewId } });
            fetchReviews();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("리뷰 삭제 실패", error);
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <>
            <BannerSection title="이용 후기" image={banner7} objectPosition="object-[50%_40%]" />
            <div className="relative z-20 bg-white">
                <Spacer size="lg" />
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6 gap-2">
                        <div className="w-1/3">
                            <Dropdown
                                value={filterTreatmentId}
                                onChange={(e) => setFilterTreatmentId(e.target.value)}
                                options={[
                                    { value: "", label: "전체 진료 항목" },
                                    ...treatments.map((t) => ({ value: String(t.treatmentId), label: t.treatmentName })),
                                ]}
                            />
                        </div>
                        <Button variant="primary" onClick={openCreate}>리뷰 작성</Button>
                    </div>

                    <div className="space-y-4">
                        {reviews.length === 0 && (
                            <p className="text-center text-gray-500 py-10">등록된 리뷰가 없습니다.</p>
                        )}
                        {reviews.map((r) => (
                            <div key={r.reviewId} className="border rounded-lg p-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="font-bold text-lg">{r.title}</h3>
                                    <span className="text-sm text-gray-500">{treatmentName(r.treatmentId)}</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap mb-2">{r.content}</p>
                                {r.imageUrl && (
                                    <img src={r.imageUrl} alt={r.title} className="max-h-64 mx-auto my-2 rounded" />
                                )}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{r.hashTag}</span>
                                    <span>조회 {r.hits} · {formatDateTime(r.createdAt)}</span>
                                </div>
                                {r.userId === myUId && (
                                    <div className="flex gap-2 justify-end mt-2">
                                        <Button variant="secondary" className="text-sm" onClick={() => openEdit(r)}>수정</Button>
                                        <Button variant="danger" className="text-sm" onClick={() => { setSelectedReview(r); setIsDeleteModalOpen(true); }}>삭제</Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <Spacer size="lg" />
            </div>

            {/* 작성/수정 모달 */}
            <Modal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                title={form.reviewId ? "리뷰 수정" : "리뷰 작성"}
                actionLabel={form.reviewId ? "수정" : "등록"}
                onAction={handleSave}
            >
                <div className="space-y-2">
                    <Dropdown
                        value={form.treatmentId}
                        onChange={(e) => setForm((prev) => ({ ...prev, treatmentId: e.target.value }))}
                        options={treatments.map((t) => ({ value: String(t.treatmentId), label: t.treatmentName }))}
                        placeholder="진료 항목 선택"
                    />
                    <input
                        className="w-full border rounded p-2"
                        placeholder="제목"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <textarea
                        className="w-full border rounded p-2 h-28"
                        placeholder="내용"
                        value={form.content}
                        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    />
                    <input
                        className="w-full border rounded p-2"
                        placeholder="이미지 URL (선택)"
                        value={form.imageUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    <input
                        className="w-full border rounded p-2"
                        placeholder="해시태그 (선택)"
                        value={form.hashTag}
                        onChange={(e) => setForm((prev) => ({ ...prev, hashTag: e.target.value }))}
                    />
                </div>
            </Modal>

            {/* 삭제 모달 */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="리뷰 삭제"
                actionLabel="삭제"
                onAction={handleDelete}
            >
                <p className="text-sm text-gray-700">
                    <strong>{selectedReview?.title}</strong>을(를) 삭제하시겠습니까?
                </p>
            </Modal>
        </>
    );
};

export default ReviewPage;
