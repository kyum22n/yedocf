/**
 * packageName    : src.pages.admin
 * fileName       : StaffScheduleManagePage.jsx
 * description    : 직원 근무일정 관리 (StaffSchedule 도메인)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const scheduleTypeOptions = [
  { value: "WORK", label: "근무" },
  { value: "OFF", label: "휴무" },
];

const StaffScheduleManagePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [admins, setAdmins] = useState([]);

  const fetchSchedules = () => {
    axiosInstance.get("/admin/staff-schedules/all")
      .then((res) => setSchedules(res.data))
      .catch((error) => console.error("직원 일정 조회 실패", error));
  };

  useEffect(() => {
    fetchSchedules();
    axiosInstance.get("/admin/list")
      .then((res) => setAdmins(res.data))
      .catch((error) => console.error("관리자 목록 조회 실패", error));
  }, []);

  const adminName = (id) => admins.find((a) => a.adminId === id)?.adminName ?? id;
  const adminOptions = admins.map((a) => ({ value: String(a.adminId), label: `${a.adminName} (${a.adminLoginId})` }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ scheduleId: null, adminId: "", scheduleDate: "", scheduleType: "WORK", memo: "" });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openCreate = () => {
    setForm({
      scheduleId: null,
      adminId: admins[0] ? String(admins[0].adminId) : "",
      scheduleDate: "",
      scheduleType: "WORK",
      memo: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({
      scheduleId: s.scheduleId,
      adminId: String(s.adminId),
      scheduleDate: s.scheduleDate,
      scheduleType: s.scheduleType,
      memo: s.memo || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      adminId: Number(form.adminId),
      scheduleDate: form.scheduleDate,
      scheduleType: form.scheduleType,
      memo: form.memo,
    };

    try {
      if (form.scheduleId) {
        await axiosInstance.put("/admin/staff-schedules/update", { ...payload, scheduleId: form.scheduleId });
      } else {
        await axiosInstance.post("/admin/staff-schedules/register", payload);
      }
      fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("일정 저장 실패", error);
      if (error.response?.status === 409) {
        alert("해당 관리자는 그 날짜에 이미 일정이 등록되어 있습니다.");
      } else {
        alert(error.response?.data?.message || "저장에 실패했습니다.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/staff-schedules/delete/${selectedSchedule.scheduleId}`);
      fetchSchedules();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("일정 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">직원 근무일정 관리</h1>

        <div className="flex mb-4 justify-end">
          <Button variant="primary" className="bg-green-600" onClick={openCreate}>일정 추가</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">관리자</th>
                <th className="px-4 py-3 border">날짜</th>
                <th className="px-4 py-3 border">구분</th>
                <th className="px-4 py-3 border">메모</th>
                <th className="py-3 border">변경 / 삭제</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.scheduleId} className="text-center">
                  <td className="px-4 py-2 border">{adminName(s.adminId)}</td>
                  <td className="px-4 py-2 border">{s.scheduleDate}</td>
                  <td className="px-4 py-2 border">{scheduleTypeOptions.find((o) => o.value === s.scheduleType)?.label ?? s.scheduleType}</td>
                  <td className="px-4 py-2 border">{s.memo}</td>
                  <td className="py-2 border flex justify-center gap-2">
                    <Button variant="secondary" onClick={() => openEdit(s)}>변경</Button>
                    <Button variant="danger" onClick={() => { setSelectedSchedule(s); setIsDeleteModalOpen(true); }}>삭제</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 추가/수정 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={form.scheduleId ? "일정 변경" : "일정 추가"}
          actionLabel={form.scheduleId ? "변경" : "추가"}
          onAction={handleSave}
        >
          <div className="space-y-2">
            <Dropdown
              value={form.adminId}
              onChange={(e) => setForm((prev) => ({ ...prev, adminId: e.target.value }))}
              options={adminOptions}
              placeholder="관리자 선택"
            />
            <InputField
              name="scheduleDate"
              type="date"
              variant="admin"
              value={form.scheduleDate}
              onChange={(e) => setForm((prev) => ({ ...prev, scheduleDate: e.target.value }))}
            />
            <Dropdown
              value={form.scheduleType}
              onChange={(e) => setForm((prev) => ({ ...prev, scheduleType: e.target.value }))}
              options={scheduleTypeOptions}
            />
            <InputField
              name="memo"
              placeholder="메모"
              variant="admin"
              value={form.memo}
              onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
            />
          </div>
        </Modal>

        {/* 삭제 모달 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="일정 삭제"
          actionLabel="삭제"
          onAction={handleDelete}
        >
          <p className="text-sm text-gray-700">
            <strong>{adminName(selectedSchedule?.adminId)}</strong>의 <strong>{selectedSchedule?.scheduleDate}</strong> 일정을 삭제하시겠습니까?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default StaffScheduleManagePage;
