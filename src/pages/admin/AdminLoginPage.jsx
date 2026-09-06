// src/pages/admin/AdminLoginPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useUser } from "@/contexts/UserProvider";

import SidebarMinimal from "@/components/admin/SidebarMinimal";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  // 로그인 상태 자동 리다이렉트 로직 구현
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    if (token && (role === "ADMIN" || role === "SUPERADMIN")) {
      navigate("/admin");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/admin/login", {
        adminLoginId: form.username,
        adminPassword: form.password,
      });

      const { accessToken, adminId, adminLoginId, adminRole } = response.data;
      if (!accessToken) {
        throw new Error("로그인 실패 : 토큰을 받지 못했습니다.");
      }

      loginUser({
        id: adminLoginId,
        adminId,
        token: accessToken,
        role: adminRole,
        type: "admin",
      });

      navigate("/admin");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
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
        </form>
      </main>
    </div>
  );
};

export default AdminLoginPage;
