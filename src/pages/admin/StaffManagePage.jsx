/**
 * packageName    : src.api.noticeEvent
 * fileName       : StaffManagePage.jsx
 * author         : lkm
 * date           : 25.06.11
 * description    : API 연동
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState, useEffect } from "react";
import axios from "axios";


const StaffManagePage = () => {
    // 직원 목록 불러오기
    const [staffList, setStaffList] = useState([]);
    
    const fetchStaff = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await axios.get("/api/admin/staff", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setStaffList(response.data);
            
        } catch (error) {
            console.error("직원 목록 불러오기 실패", error);
        }
    };

    // api 호출
    useEffect(() => {
        fetchStaff();
    }, []);
    
    const [form, setForm] = useState({
        aId: "",
        aPwd: "",
        aEmail: "",
        role: "ADMIN", // 기본값은 일반 관리자
        createdBy: "SUPERADMIN", // 최고 관리자에 의해 생성됨
    });

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const handleCloseDeleteModal = () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
    };

    const searchOptions = [
        { value: "name", label: "이름" },
        { value: "username", label: "아이디" },
        { value: "password", label: "비밀번호" },
        { value: "email", label: "이메일" },
    ];

    const selectedLabel = searchOptions.find(opt => opt.value === searchCategory)?.label;

    return (
        <div className="flex">
            <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />

            <main className="w-full min-h-screen p-8 bg-gray-50">
                <h1 className="text-2xl font-bold mb-6">직원 관리</h1>
                <div className="flex mb-4 justify-end gap-4">

                {/* 검색 & 추가 버튼
                <div className="flex mb-4 justify-between items-center gap-4">
                    <div className="flex gap-2">
                        <Dropdown
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            options={searchOptions}
                            className="h-10"
                        />
                        <div className="w-1/2">
                            <InputField
                                name="searchText"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder={
                                    searchCategory
                                        ? `${selectedLabel}을(를) 입력하세요`
                                        : "검색할 항목을 먼저 선택하세요"
                                }
                                variant="admin"
                                className="h-10"
                                labelHidden={true}
                            />
                        </div>
                        <Button variant="primary" className="h-10">검색</Button>
                    </div> */}

                    <Button
                        variant="primary"
                        className="h-10 bg-green-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        직원 추가
                    </Button>
                </div>

                {/* 직원 테이블 */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-center text-sm font-semibold">
                                <th className="px-4 py-3 border">아이디</th>
                                <th className="px-4 py-3 border">비밀번호</th>
                                <th className="px-4 py-3 border">이메일</th>
                                <th className="px-4 py-3 border">권한</th>
                                <th className="px-4 py-3 border">생성자</th>
                                <th className="py-3 border">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((user) => (
                                <tr key={user.aId} className="text-center">
                                    <td className="px-4 py-2 border">{user.aId}</td>
                                    <td className="px-4 py-2 border text-center group">••••••</td>
                                    <td className="px-4 py-2 border">{user.aEmail}</td>
                                    <td className="px-4 py-2 border">{user.role}</td>
                                    <td className="px-4 py-2 border">{user.createdBy}</td>
                                    <td className="py-2 border text-center">
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setSelectedUser(user);
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

                {/* 직원 추가 모달 */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="직원 추가"
                    actionLabel="추가"
                    resetOnClose={true}
                    onAction={async () => {
                        try {
                            const token = sessionStorage.getItem("accessToken");
                            await axios.post("/api/admin/staff", {
                                aId: form.aId,
                                aPwd: form.aPwd,
                                aEmail: form.aEmail,
                                role: form.role,
                                createdBy: "SUPERADMIN",
                            }, {
                                headers: {Authorization: `Bearer ${token}`},
                            });

                            alert("직원 등록이 완료되었습니다.");
                            setIsModalOpen(false);
                            fetchStaff(); // 직원 목록 새로고침
                            
                        } catch (error) {
                            console.log("직원 등록이 실패했습니다.", error);
                            alert("직원 등록이 실패했습니다. 다시 시도해주세요.");
                        }
                    }}
                >
                    <InputField
                        name="aId"
                        value={form.aId}
                        onChange={(e) => setForm((prev) => ({ ...prev, aId:e.target.value }))}
                        placeholder="아이디"
                        variant="admin"
                        className="p-2"
                    />
                    <InputField
                        name="aPwd"
                        value={form.aPwd}
                        onChange={(e) => setForm((prev) => ({ ...prev, aPwd:e.target.value }))}
                        placeholder="비밀번호"
                        variant="admin"
                        type="password"
                        className="p-2"
                    />
                    <InputField
                        name="aEmail"
                        value={form.aEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, aEmail:e.target.value }))}
                        placeholder="이메일"
                        variant="admin"
                        className="p-2"
                    />

                    <Dropdown
                        name="role"
                        value={form.role}
                        onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                        options={[
                            { value: "ADMIN", label: "일반 관리자" },
                            { value: "SUPERADMIN", label: "최고 관리자" },
                        ]}
                        className="p-2"
                    />

                    <InputField
                        name={"createdBy"}
                        value={form.createdBy}
                        placeholder="SUPERADMIN"
                        onChange={(e) => setForm((prev) => ({ ...prev, createdBy:e.target.value }))}
                        readOnly
                        variant="admin"
                        className="p-2"
                    />
                </Modal>

                {/* 직원 삭제 모달 */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    title="직원 삭제"
                    actionLabel="삭제"
                    onAction={ async () => {
                        try {
                            const token = sessionStorage.getItem("accessToken");
                            await axios.delete(`/api/admin/staff/${selectedUser.aId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            alert("직원 삭제가 완료되었습니다.");
                            handleCloseDeleteModal();
                            fetchStaff(); // 직원 목록 새로고침
                        } catch (error){
                            console.error("삭제 실패:", error);
                            alert("직원 삭제에 실패했습니다. 다시 시도해주세요.");
                        }
                    }}
                >
                    <p className="text-sm text-gray-700">
                        직원 <strong>{selectedUser?.aId}</strong>을(를) 정말 삭제하시겠습니까?
                    </p>
                </Modal>
            </main>
        </div>
    );
};

export default StaffManagePage;
