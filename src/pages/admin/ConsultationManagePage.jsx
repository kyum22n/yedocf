/**
 * packageName    : src.pages.admin
 * fileName       : ConsultationManagePage.jsx
 * description    : 상담 관리 (Consultation 도메인)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useUser } from "@/contexts/UserProvider";

const statusOptions = [
  { value: "RECEIVED", label: "접수" },
  { value: "SCHEDULED", label: "상담 예정" },
  { value: "COMPLETED", label: "상담 완료" },
  { value: "CONVERTED", label: "예약 전환됨" },
  { value: "CANCELED", label: "취소" },
];

const ConsultationManagePage = () => {
  const { user } = useUser();
  const [consultations, setConsultations] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const fetchConsultations = () => {
    axiosInstance.get("/admin/consultations/all")
      .then((res) => setConsultations(res.data))
      .catch((error) => console.error("상담 목록 조회 실패", error));
  };

  useEffect(() => {
    fetchConsultations();
    axiosInstance.get("/admin/treatments/all")
      .then((res) => setTreatments(res.data))
      .catch((error) => console.error("진료 항목 조회 실패", error));
  }, []);

  const treatmentName = (id) => treatments.find((t) => t.treatmentId === id)?.treatmentName ?? id;

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ consultationStatus: "RECEIVED", consultationMemo: "" });

  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertMemo, setConvertMemo] = useState("");
  const [convertReservationId, setConvertReservationId] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openStatusModal = (c) => {
    setSelectedConsultation(c);
    setStatusForm({ consultationStatus: c.consultationStatus, consultationMemo: c.consultationMemo || "" });
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.put("/admin/consultations/status/update", {
        consultationId: selectedConsultation.consultationId,
        adminId: user?.adminId,
        consultationStatus: statusForm.consultationStatus,
        consultationMemo: statusForm.consultationMemo,
      });
      fetchConsultations();
      setIsStatusModalOpen(false);
    } catch (error) {
      console.error("상담 상태 변경 실패", error);
      alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleConvert = async () => {
    if (!convertReservationId) {
      alert("먼저 예약 관리에서 해당 회원의 예약을 등록한 뒤, 그 예약 ID를 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.put("/admin/consultations/convert", {
        consultationId: selectedConsultation.consultationId,
        reservationId: Number(convertReservationId),
        adminId: user?.adminId,
        consultationMemo: convertMemo,
      });
      alert("예약으로 전환되었습니다.");
      fetchConsultations();
      setIsConvertModalOpen(false);
    } catch (error) {
      console.error("예약 전환 실패", error);
      alert(error.response?.data?.message || "예약 전환에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/consultations/delete/${selectedConsultation.consultationId}`);
      fetchConsultations();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("상담 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">상담 관리</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">상담 ID</th>
                <th className="px-4 py-3 border">신청자 아이디</th>
                <th className="px-4 py-3 border">진료 항목</th>
                <th className="px-4 py-3 border">희망 날짜</th>
                <th className="px-4 py-3 border">희망 시간</th>
                <th className="px-4 py-3 border">메모</th>
                <th className="px-4 py-3 border">상태</th>
                <th className="py-3 border">처리</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => (
                <tr key={c.consultationId} className="text-center">
                  <td className="px-4 py-2 border">{c.consultationId}</td>
                  <td className="px-4 py-2 border">{c.uId}</td>
                  <td className="px-4 py-2 border">{treatmentName(c.treatmentId)}</td>
                  <td className="px-4 py-2 border">{c.preferredDate}</td>
                  <td className="px-4 py-2 border">{c.preferredTime}</td>
                  <td className="px-4 py-2 border">{c.consultationMemo}</td>
                  <td className="px-4 py-2 border">
                    {statusOptions.find((s) => s.value === c.consultationStatus)?.label ?? c.consultationStatus}
                  </td>
                  <td className="py-2 border">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button variant="secondary" onClick={() => openStatusModal(c)}>상태 변경</Button>
                      {c.consultationStatus !== "CONVERTED" && c.consultationStatus !== "CANCELED" && (
                        <Button
                          variant="primary"
                          onClick={() => { setSelectedConsultation(c); setConvertMemo(""); setConvertReservationId(""); setIsConvertModalOpen(true); }}
                        >
                          예약 전환
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        onClick={() => { setSelectedConsultation(c); setIsDeleteModalOpen(true); }}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상태 변경 모달 */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="상담 상태 변경"
          actionLabel="변경"
          onAction={handleStatusUpdate}
        >
          <div className="space-y-2">
            <Dropdown
              value={statusForm.consultationStatus}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, consultationStatus: e.target.value }))}
              options={statusOptions}
            />
            <InputField
              name="consultationMemo"
              placeholder="관리자 메모"
              variant="admin"
              value={statusForm.consultationMemo}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, consultationMemo: e.target.value }))}
            />
          </div>
        </Modal>

        {/* 예약 전환 모달 */}
        <Modal
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          title="예약으로 전환"
          actionLabel="전환"
          onAction={handleConvert}
        >
          <p className="text-sm text-gray-700 mb-2">
            상담 <strong>{selectedConsultation?.consultationId}</strong>을(를) 예약으로 전환합니다.
            먼저 "예약 관리"에서 이 회원의 예약을 등록한 뒤, 그 예약 ID를 아래에 입력하세요.
          </p>
          <InputField
            name="convertReservationId"
            placeholder="예약 ID"
            type="number"
            variant="admin"
            value={convertReservationId}
            onChange={(e) => setConvertReservationId(e.target.value)}
            className="mb-2"
          />
          <InputField
            name="convertMemo"
            placeholder="전환 메모"
            variant="admin"
            value={convertMemo}
            onChange={(e) => setConvertMemo(e.target.value)}
          />
        </Modal>

        {/* 삭제 모달 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="상담 삭제"
          actionLabel="삭제"
          onAction={handleDelete}
        >
          <p className="text-sm text-gray-700">
            상담 <strong>{selectedConsultation?.consultationId}</strong>을(를) 삭제하시겠습니까?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default ConsultationManagePage;
