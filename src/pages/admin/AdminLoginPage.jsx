// src/pages/admin/AdminLoginPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarMinimal from "@/components/admin/SidebarMinimal";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";

/**
 * packageName    : src.api.noticeEvent
 * fileName       : noticeEvent.js
 * author         : lkm
 * date           : 25.06.11
 * description    : 관리자 로그인 API 연동 및 아이디/비밀번호 찾기 기능 구현
 * ===========================================================
 */

const AdminLoginPage = () => {
  const navigate = useNavigate();

  // 로그인 상태 자동 리다이렉트 로직 구현
  useEffect(() => { 
    const token = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    if (token && (role === "ADMIN" || role === "SUPERADMIN")) {
      navigate("/admin");
    }
  }, [navigate]);

  // 모달 및 상태 관리
  const [showFindModal, setShowFindModal] = useState(false);
  const [findMode, setFindMode] = useState("id");
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [aId, setAId] = useState("");
  const [foundId, setFoundId] = useState("");
  const [foundPwd, setFoundPwd] = useState("");
  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인
    try {
      const response = await axios.post("/api/admin/login", {
        aId: form.username,
        aPwd: form.password,
        }
      );

      // 토큰 받기
      const token = response.data.token;
      if (!token) {
        throw new Error("로그인 실패 : 토큰을 받지 못했습니다.");
      }

      // 관리자 권한 확인
      const role = response.data.role || "ADMIN";
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        throw new Error("로그인 실패 : 관리자 권한이 없습니다.");
      }

      // sessionStorage에 토큰 저장
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("aId", form.username);

      // 로그인 성공 후 대시보드로 이동
      navigate("/admin");

    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 잘못되었습니다.");

    }

  };

  // 아이디 찾기
  const handleFindId = async () => {
    try {
      const response = await axios.post("/api/admin/find_id", null, {
        params: { aEmail: email },
      });
      setFoundId(response.data.aId);
      setMessage("아이디는 " + response.data.aId + "입니다.");
    } catch (error) {
      setMessage("아이디를 찾을 수 없습니다.");
      console.error("아이디 찾기 실패", error);
    }
  };

  // 비밀번호 찾기
  const handleFindPwd = async () => {
    try {
      const response = await axios.post("/api/admin/find_password", null, {
        params: { aId, aEmail: email },
      });
      setFoundPwd(response.data.aPwd);
      setMessage("비밀번호가 이메일로 전송되었습니다.");
    } catch (error) {
      setMessage("비밀번호를 찾을 수 없습니다.");
      console.error("비밀번호 찾기 실패", error);
    }
  };

  return (
    <div className="flex">
      <SidebarMinimal />
      <main className="w-full h-screen flex-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-center mb-8">관리자 로그인</h2>

          <InputField
            label="관리자 아이디"
            labelHidden={true}
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="관리자 아이디를 입력하세요"
            variant="admin"
            className="h-12 mb-2"
          />

          <InputField
            label="관리자 비밀번호"
            labelHidden={true}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="관리자 비밀번호를 입력하세요"
            variant="admin"
            className="h-12"
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
            로그인
          </Button>

          <div className="text-sm w-full flex justify-evenly items-center gap-2 mt-4">
            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={() => {
                setFindMode("id");
                setShowFindModal(true);
              }}
            >
              아이디 찾기
            </button>
            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={() => {
                setFindMode("password");
                setShowFindModal(true);
              }}
            >
              비밀번호 찾기
            </button>
          </div>
        </form>
      </main>

      {/* 모달 영역 */}
      {showFindModal && (
        <Modal
          isOpen={showFindModal}
          onClose={() => setShowFindModal(false)}
          title={findMode === "id" ? "아이디 찾기" : "비밀번호 찾기"}
          actionLabel="찾기"
          onAction={findMode === "id" ? handleFindId : handleFindPwd}
          cancelLabel="닫기"
        >
          <InputField
            label="이메일"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className="mb-4 h-12"
          />

          {findMode === "password" && (
            <InputField
              label="아이디"
              name="aId"
              value={aId}
              onChange={(e) => setAId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="h-12"
            />
          )}

          {message && <p className="mt-4 text-sm text-red-500 test-gray-700">{message}</p>}
        </Modal>
      )}
    </div>
  );
};

export default AdminLoginPage;
