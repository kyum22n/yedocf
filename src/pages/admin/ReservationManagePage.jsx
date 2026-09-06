/**
 * packageName    : src.pages.admin
 * fileName       : ReservationManagePage.jsx
 * author         : jkw
 * date           : 25.06.10
 * description    : 예약 관리 - 관리자 페이지
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TimeSelectorSelect from "@/components/admin/TimeSelectorSelect";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useUser } from "@/contexts/UserProvider";

const statusOptions = [
  { value: "PENDING", label: "대기" },
  { value: "CONFIRMED", label: "확정" },
  { value: "COMPLETED", label: "완료" },
  { value: "CANCELED", label: "취소" },
  { value: "NO_SHOW", label: "노쇼" },
];

const ReservationManagePage = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userId, setUserId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("PENDING");

  const [treatments, setTreatments] = useState([]);
  const treatmentOptions = treatments.map((t) => ({ value: String(t.treatmentId), label: t.treatmentName }));

  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchReservations = () => {
    axiosInstance.get("/admin/reservations/all")
      .then((res) => setReservations(res.data))
      .catch((error) => console.error("예약 목록 조회 실패", error));
  };

  useEffect(() => {
    fetchReservations();

    axiosInstance.get("/admin/treatments/all")
      .then((res) => setTreatments(res.data))
      .catch((error) => console.error("진료 항목 조회 실패", error));
  }, []);

  const handleStatusChange = (reservationId, reservationStatus) => {
    axiosInstance
      .put(`/admin/reservations/status/update`, { reservationId, adminId: user?.adminId, reservationStatus })
      .then(() => {
        setReservations((prev) =>
          prev.map((r) => (r.reservationId === reservationId ? { ...r, reservationStatus } : r))
        );
      })
      .catch((error) => {
        console.error("예약 상태 변경 실패", error);
      });
  };

  const handleDeleteReservation = () => {
    axiosInstance
      .delete(`/admin/reservations/delete/${selectedReservation.reservationId}`)
      .then(() => {
        fetchReservations();
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error("예약 삭제 실패: ", error);
      });
  };

  const resetForm = () => {
    setUserId("");
    setTreatmentId("");
    setSelectedDate("");
    setSelectedTime("");
    setStatus("PENDING");
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const treatmentName = (id) => treatments.find((t) => t.treatmentId === id)?.treatmentName ?? id;

  return (
    <div className="flex">
      <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />

      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">예약 관리</h1>

        <div className="flex mb-4 justify-end gap-4">
          <Button
            variant="primary"
            className="h-10 bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            예약 추가
          </Button>
        </div>

        {/* 예약 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">예약 ID</th>
                <th className="px-4 py-3 border">예약자 아이디</th>
                <th className="px-4 py-3 border">시술 항목</th>
                <th className="px-4 py-3 border">예약 날짜</th>
                <th className="px-4 py-3 border">시간대</th>
                <th className="px-4 py-3 border">예약 상태</th>
                <th className="py-3 border">변경 / 삭제</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr className="text-center" key={r.reservationId}>
                  <td className="px-4 py-2 border">{r.reservationId}</td>
                  <td className="px-4 py-2 border">{r.uId}</td>
                  <td className="px-4 py-2 border">{treatmentName(r.treatmentId)}</td>
                  <td className="px-4 py-2 border">{r.reservationDate}</td>
                  <td className="px-4 py-2 border">{r.reservationTime}</td>
                  <td className="px-4 py-2 border">
                    <select
                      className="border p-1"
                      value={r.reservationStatus}
                      onChange={(e) =>
                        handleStatusChange(r.reservationId, e.target.value)
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedReservation(r);
                          setIsEditModalOpen(true);
                        }}
                      >
                        변경
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedReservation(r);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div> {/* 예약 테이블 끝 */}

        {/* 예약 추가 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="예약 추가"
          actionLabel="추가"
          resetOnClose={true}
          onAction={async () => {
            try {
              await axiosInstance.post(
                "/admin/reservations/register",
                {
                  uId: userId,
                  treatmentId: Number(treatmentId),
                  adminId: user?.adminId,
                  reservationDate: selectedDate,
                  reservationTime: selectedTime,
                  reservationStatus: status,
                }
              );

              fetchReservations();
              setIsModalOpen(false);
              resetForm();
            } catch (err) {
              console.error("예약 추가 실패:", err);
            }
          }}
        >
          <InputField
            name="userId"
            placeholder="예약자 아이디"
            variant="admin"
            className="p-2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Dropdown
            value={treatmentId}
            onChange={(e) => setTreatmentId(e.target.value)}
            options={treatmentOptions}
            className="p-2"
          />
          <InputField
            name="date"
            type="date"
            variant="admin"
            className="p-2"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
          />
          <TimeSelectorSelect
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            className="p-2"
            labelHidden={true}
          />
          <Dropdown
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            className="p-2"
          />
        </Modal>

        {/* 예약 삭제 모달 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="예약 삭제"
          actionLabel="삭제"
          onAction={handleDeleteReservation}
        >
          <p className="text-sm text-gray-700">
            예약자 <strong>{selectedReservation?.uId}</strong>의 예약을
            삭제하시겠습니까?
          </p>
        </Modal>

        {/* 예약 수정 모달 */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="예약 변경"
          actionLabel="변경"
          resetOnClose={true}
          onAction={async () => {
            try {
              await axiosInstance.put(`/admin/reservations/update`, {
                reservationId: selectedReservation.reservationId,
                uId: selectedReservation.uId,
                treatmentId: selectedReservation.treatmentId,
                adminId: user?.adminId,
                reservationDate: selectedReservation.reservationDate,
                reservationTime: selectedReservation.reservationTime,
                reservationStatus: selectedReservation.reservationStatus,
              });

              fetchReservations();
              setIsEditModalOpen(false);
            } catch (err) {
              console.error("예약 변경 실패:", err);
            }
          }}
        >
          <InputField
            name="userId"
            placeholder="예약자 아이디"
            variant="admin"
            className="p-2"
            value={selectedReservation?.uId || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                uId: e.target.value,
              }))
            }
          />
          <Dropdown
            value={selectedReservation ? String(selectedReservation.treatmentId) : ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                treatmentId: Number(e.target.value),
              }))
            }
            options={treatmentOptions}
            className="p-2"
          />
          <InputField
            name="date"
            type="date"
            variant="admin"
            className="p-2"
            value={selectedReservation?.reservationDate || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                reservationDate: e.target.value,
                reservationTime: "",
              }))
            }
          />
          <TimeSelectorSelect
            selectedDate={selectedReservation?.reservationDate || ""}
            selectedTime={selectedReservation?.reservationTime || ""}
            onSelect={(newTime) =>
              setSelectedReservation((prev) => ({
                ...prev,
                reservationTime: newTime,
              }))
            }
            className="p-2"
            labelHidden={true}
          />
          <Dropdown
            value={selectedReservation?.reservationStatus || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                reservationStatus: e.target.value,
              }))
            }
            options={statusOptions}
            className="p-2"
          />
        </Modal>
      </main>
    </div>
  );
};

export default ReservationManagePage;
