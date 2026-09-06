/**
 * packageName    : src.pages.admin
 * fileName       : InquiryManagePage.jsx
 * author         : lkm
 * date           : 25.06.13
 * description    : 관리자 1:1 문의 관리 페이지
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import Modal from "@/components/common/Modal";
import { formatDateTime } from "@/constants/dateUtils";
import { useState, useEffect } from "react";
import axios from "axios";

const InquiryManagePage = () => {
    // 상태 관리
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qAnswer, setQAnswer] = useState("");

    // 문의 목록 조회
    const fetchInquiries = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await axios.get("/api/admin/inquiry", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInquiries(response.data);
        } catch (error) {
            console.error("문의 목록 불러오기 실패", error);
        }
    }

    // 문의 답변 제출
    useEffect(() => {
        fetchInquiries();
    }, []);

    // 문의 답변 핸들러
    const handleAnswerSubmit = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            await axios.post(`/api/admin/inquiry/${selectedInquiry.qId}/answer`, {
                qAnswer: qAnswer
            }, {
                headers: {Authorization: `Bearer ${token}`},
            });

            console.log("토큰:", token);
            alert("답변이 등록되었습니다.");
            setIsModalOpen(false);
            setQAnswer("");
            fetchInquiries(); // 목록 새로 고침

        } catch (error) {
            console.error("답변 등록 실패", error);
            alert("답변 등록에 실패했습니다.");
        }
    };

    return (
        <div className="flex">
            <Sidebar isLoggedIn={true} />
            <main className="w-full min-h-screen p-8 bg-gray-50">
                <h1 className="text-2xl font-bold mb-6">1:1 문의 관리</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-center text-sm font-semibold">
                                <th className="px-4 py-3 border">아이디</th>
                                <th className="px-4 py-3 border">이름</th>
                                <th className="px-4 py-3 border">이메일</th>
                                <th className="px-4 py-3 border">방문 여부</th>
                                <th className="px-4 py-3 border">문의 내용</th>
                                <th className="px-4 py-3 border">작성일자</th>
                                <th className="px-4 py-3 border">처리 상태</th>
                                <th className="px-4 border">답변</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {inquiries.map((q) => (
                                <tr key={q.qId} className="text-center">
                                    <td className="px-4 py-4 border">{q.uId}</td>
                                    <td className="px-4 py-4 border">{q.uName}</td>
                                    <td className="px-4 py-4 border">{q.uEmail}</td>
                                    <td className="px-4 py-4 border">{q.visit ? "O" : "X"}</td>
                                    <td className="px-4 py-4 border">{q.qContent}</td>
                                    <td className="px-4 py-4 border">{formatDateTime(q.createdAt)}</td>
                                    <td className="px-4 py-4 border">{q.qStatus}</td>
                                    <td className="px-4 py-4 border">
                                        <button
                                            variant="primary"
                                            className="text-blue-500 hover:underline"
                                            onClick={() => {
                                                setSelectedInquiry(q);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            답변하기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="문의 답변"
                    actionLabel="답변 등록"
                    onAction={handleAnswerSubmit}
                >
                    <div>
                        <p className="mb-2 text-sm text-gray-600">문의 내용</p>
                        <p className="text-gray-800 bg-gray-100 p-2 rounded text-sm mb-4">
                            {selectedInquiry?.qContent}
                        </p>

                        <textarea
                            className="w-full border rounded p-2"
                            placeholder="답변을 입력하세요"
                            value={qAnswer}
                            onChange={(e) => setQAnswer(e.target.value)}
                        />
                    </div>
                </Modal>
            </main>
        </div>
    );

};

export default InquiryManagePage;