/**
 * packageName    : src.api.noticeEvent
 * fileName       : StaffManagePage.jsx
 * author         : lkm
 * date           : 25.06.11
 * description    : 관리자 계정 관리 (Admin 도메인 — 직원 근무일정과는 별개)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";


const StaffManagePage = () => {
    // 관리자 계정 목록 불러오기
    const [staffList, setStaffList] = useState([]);

    const fetchStaff = async () => {
        try {
            const response = await axiosInstance.get("/admin/list");
            setStaffList(response.data);

        } catch (error) {
            console.error("관리자 목록 불러오기 실패", error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const [form, setForm] = useState({
        adminLoginId: "",
        adminPassword: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        adminRole: "ADMIN", // 기본값은 일반 관리자
    });

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleCloseDeleteModal = () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex">
            <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />

            <main className="w-full min-h-screen p-8 bg-gray-50">
                <h1 className="text-2xl font-bold mb-6">관리자 계정 관리</h1>
                <div className="flex mb-4 justify-end gap-4">
                    <Button
                        variant="primary"
                        className="h-10 bg-green-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        관리자 추가
                    </Button>
                </div>

                {/* 관리자 테이블 */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-center text-sm font-semibold">
                                <th className="px-4 py-3 border">아이디</th>
                                <th className="px-4 py-3 border">이름</th>
                                <th className="px-4 py-3 border">이메일</th>
                                <th className="px-4 py-3 border">전화번호</th>
                                <th className="px-4 py-3 border">권한</th>
                                <th className="py-3 border">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((admin) => (
                                <tr key={admin.adminId} className="text-center">
                                    <td className="px-4 py-2 border">{admin.adminLoginId}</td>
                                    <td className="px-4 py-2 border">{admin.adminName}</td>
                                    <td className="px-4 py-2 border">{admin.adminEmail}</td>
                                    <td className="px-4 py-2 border">{admin.adminPhone}</td>
                                    <td className="px-4 py-2 border">{admin.adminRole}</td>
                                    <td className="py-2 border text-center">
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setSelectedUser(admin);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 관리자 추가 모달 */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="관리자 추가"
                    actionLabel="추가"
                    resetOnClose={true}
                    onAction={async () => {
                        try {
                            await axiosInstance.post("/admin/register", {
                                adminLoginId: form.adminLoginId,
                                adminPassword: form.adminPassword,
                                adminName: form.adminName,
                                adminEmail: form.adminEmail,
                                adminPhone: form.adminPhone,
                                adminRole: form.adminRole,
                            });

                            alert("관리자 등록이 완료되었습니다.");
                            setIsModalOpen(false);
                            fetchStaff(); // 목록 새로고침

                        } catch (error) {
                            console.error("관리자 등록이 실패했습니다.", error);
                            alert(error.response?.data?.message || "관리자 등록이 실패했습니다. 다시 시도해주세요.");
                        }
                    }}
                >
                    <InputField
                        name="adminLoginId"
                        value={form.adminLoginId}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminLoginId: e.target.value }))}
                        placeholder="아이디"
                        variant="admin"
                        className="p-2"
                    />
                    <InputField
                        name="adminPassword"
                        value={form.adminPassword}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminPassword: e.target.value }))}
                        placeholder="비밀번호"
                        variant="admin"
                        type="password"
                        className="p-2"
                    />
                    <InputField
                        name="adminName"
                        value={form.adminName}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminName: e.target.value }))}
                        placeholder="이름"
                        variant="admin"
                        className="p-2"
                    />
                    <InputField
                        name="adminEmail"
                        value={form.adminEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminEmail: e.target.value }))}
                        placeholder="이메일"
                        variant="admin"
                        className="p-2"
                    />
                    <InputField
                        name="adminPhone"
                        value={form.adminPhone}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminPhone: e.target.value }))}
                        placeholder="전화번호"
                        variant="admin"
                        className="p-2"
                    />

                    <Dropdown
                        name="adminRole"
                        value={form.adminRole}
                        onChange={(e) => setForm((prev) => ({ ...prev, adminRole: e.target.value }))}
                        options={[
                            { value: "ADMIN", label: "일반 관리자" },
                            { value: "SUPERADMIN", label: "최고 관리자" },
                        ]}
                        className="p-2"
                    />
                </Modal>

                {/* 관리자 삭제 모달 */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    title="관리자 삭제"
                    actionLabel="삭제"
                    onAction={async () => {
                        try {
                            await axiosInstance.delete(`/admin/delete/${selectedUser.adminId}`);

                            alert("관리자 삭제가 완료되었습니다.");
                            handleCloseDeleteModal();
                            fetchStaff(); // 목록 새로고침
                        } catch (error) {
                            console.error("삭제 실패:", error);
                            alert("관리자 삭제에 실패했습니다. 다시 시도해주세요.");
                        }
                    }}
                >
                    <p className="text-sm text-gray-700">
                        관리자 <strong>{selectedUser?.adminLoginId}</strong>을(를) 정말 삭제하시겠습니까?
                    </p>
                </Modal>
            </main>
        </div>
    );
};

export default StaffManagePage;
