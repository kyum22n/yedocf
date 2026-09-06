/**
 * packageName    : src.pages.admin
 * fileName       : UserManagePage.jsx
 * author         : jkw
 * date           : 25.06.10
 * description    : 사용자(유저) 관리 - 관리자 페이지
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";


/**
 * packageName    : src.api.noticeEvent
 * fileName       : UserManagePage.jsx
 * author         : lkm
 * date           : 25.06.11
 * description    : 403 오류 해결
 * ===========================================================
 */

const UserManagePage = () => {
  // 사용자 목록 상태 정의
  const [users, setUsers] = useState([]);
  
  // 사용자 목록 API 호출
  useEffect(() => {
    // 토큰 가져오기
    const token = sessionStorage.getItem("accessToken");

    axios.get("/api/admin/user/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setUsers(res.data);
    });
  }, []);

  // 모달 및 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const searchOptions = [
    { value: "name", label: "이름" },
    { value: "username", label: "아이디" },
    { value: "password", label: "비밀번호" },
    { value: "email", label: "이메일" },
    { value: "phone", label: "전화번호" },
  ];

  const selectedLabel = searchOptions.find(
    (opt) => opt.value === searchCategory
  )?.label;

  const handleCloseDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex">
      <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />


      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">회원 관리</h1>

        {/* 상단 검색 영역 */}
        <div className="flex mb-4 justify-end gap-4">
{/* 
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
            <Button variant="primary" className="h-10">
              검색
            </Button>
          </div> */}

          <Button
            variant="primary"
            className="h-10 bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            회원 추가
          </Button>
        </div>

        {/* 회원 목록 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">이름</th>
                <th className="px-4 py-3 border">아이디</th>
                <th className="px-4 py-3 border">비밀번호</th>
                <th className="px-4 py-3 border">이메일</th>
                <th className="px-4 py-3 border">전화번호</th>
                <th className="py-3 border">회원 삭제</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="text-center" key={user.uId}>
                  <td className="px-4 py-2 border">{user.uName}</td>
                  <td className="px-4 py-2 border">{user.uId}</td>
                  <td className="px-4 py-2 border group">••••••</td>
                  <td className="px-4 py-2 border">{user.uEmail}</td>
                  <td className="px-4 py-2 border">{user.uPhone}</td>
                  <td className="py-2 border">
                    <Button
                      variant="danger"
                      className="px-6 py-1"
                      onClick={() => {
                        setSelectedUser({
                          name: user.uName,
                          username: user.uId,
                          id: user.uId,
                        });
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

        {/* 회원 추가 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="회원 추가"
          actionLabel="추가"
          resetOnClose={true}
          onAction={async () => {
            try {
              // 입력 필드 값 상태로 관리 필요 (추가 구현 필요)
              const name = document.querySelector("input[name='name']").value;
              const username = document.querySelector("input[name='username']").value;
              const password = document.querySelector("input[name='password']").value;
              const email = document.querySelector("input[name='email']").value;
              const phone = document.querySelector("input[name='phone']").value;

              // 토큰 가져오기
              const token = sessionStorage.getItem("accessToken");

              const response = await axios.post("/api/admin/user", {
                uName: name,
                uId: username,
                uPwd: password,
                uEmail: email,
                uPhone: phone,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              setUsers([...users, response.data]);
              setIsModalOpen(false);
            } catch (err) {
              console.error("회원 추가 실패:", err);
            }
          }}
        >
          <InputField
            name="name"
            placeholder="이름"
            variant="admin"
            className="w-full p-2 rounded"
          />
          <InputField
            name="username"
            placeholder="아이디"
            variant="admin"
            className="w-full p-2 rounded"
          />
          <InputField
            name="password"
            placeholder="비밀번호"
            type="password"
            variant="admin"
            className="w-full p-2 rounded"
          />
          <InputField
            name="email"
            placeholder="이메일"
            variant="admin"
            className="w-full p-2 rounded"
          />
          <InputField
            name="phone"
            placeholder="전화번호"
            variant="admin"
            className="w-full p-2 rounded"
          />
        </Modal>

        {/* 회원 삭제 모달 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="회원 삭제"
          actionLabel="삭제"
          onAction={() => {
            // 토큰 가져오기
            const token = sessionStorage.getItem("accessToken");

            axios.post(`/api/admin/user/${selectedUser?.id}`, null, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).then(() => {
              setUsers(users.filter((user) => user.uId !== selectedUser?.id));
              handleCloseDeleteModal();
            });
          }}
        >
          <p className="text-sm text-gray-700">
            회원 <strong>{selectedUser?.name}</strong>({selectedUser?.username}
            )을(를) 정말 삭제하시겠습니까?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default UserManagePage;
