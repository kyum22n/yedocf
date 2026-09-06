/**
 * packageName    : src.pages.admin
 * fileName       : ReviewManagePage.jsx
 * description    : 리뷰 모더레이션 (Review 도메인 - 관리자)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { formatDateTime } from "@/constants/dateUtils";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const ReviewManagePage = () => {
  const [reviews, setReviews] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const fetchReviews = () => {
    axiosInstance.get("/admin/reviews/all")
      .then((res) => setReviews(res.data))
      .catch((error) => console.error("리뷰 목록 조회 실패", error));
  };

  useEffect(() => {
    fetchReviews();
    axiosInstance.get("/admin/treatments/all")
      .then((res) => setTreatments(res.data))
      .catch((error) => console.error("진료 항목 조회 실패", error));
  }, []);

  const treatmentName = (id) => treatments.find((t) => t.treatmentId === id)?.treatmentName ?? id;

  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggleHidden = async (review) => {
    try {
      await axiosInstance.put(`/admin/reviews/hide`, null, {
        params: { reviewId: review.reviewId, isHidden: !review.isHidden },
      });
      fetchReviews();
    } catch (error) {
      console.error("리뷰 숨김 처리 실패", error);
      alert("처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/reviews/delete`, { params: { reviewId: selectedReview.reviewId } });
      fetchReviews();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("리뷰 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">리뷰 관리</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">작성자</th>
                <th className="px-4 py-3 border">진료 항목</th>
                <th className="px-4 py-3 border">제목</th>
                <th className="px-4 py-3 border">조회수</th>
                <th className="px-4 py-3 border">작성일</th>
                <th className="px-4 py-3 border">상태</th>
                <th className="py-3 border">처리</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.reviewId} className="text-center">
                  <td className="px-4 py-2 border">{r.userId}</td>
                  <td className="px-4 py-2 border">{treatmentName(r.treatmentId)}</td>
                  <td className="px-4 py-2 border">{r.title}</td>
                  <td className="px-4 py-2 border">{r.hits}</td>
                  <td className="px-4 py-2 border">{formatDateTime(r.createdAt)}</td>
                  <td className="px-4 py-2 border">{r.isHidden ? "숨김" : "노출"}</td>
                  <td className="py-2 border flex justify-center gap-2">
                    <Button variant="secondary" onClick={() => handleToggleHidden(r)}>
                      {r.isHidden ? "노출 전환" : "숨김 처리"}
                    </Button>
                    <Button variant="danger" onClick={() => { setSelectedReview(r); setIsDeleteModalOpen(true); }}>삭제</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </main>
    </div>
  );
};

export default ReviewManagePage;
