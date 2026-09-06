import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const uId = sessionStorage.getItem("uId");
    const aId = sessionStorage.getItem("aId");
    const role = sessionStorage.getItem("role");

    console.log("[UserProvider] 복원 시도: ", { token, uId, aId, role });

    if (!token) {
      console.log("[UserProvider] 토큰 없음 → 비로그인 처리");
      setLoading(false);
      return;
    }// 토큰 없으면 아무것도 하지 않음

    // 관리자 먼저 확인 (우선순위 높임)
    if (aId && role) {
      console.log("[UserProvider] 관리자 로그인 복원됨");
      setUser({
        id: aId,
        name: null,
        token,
        role,
        type: "admin",
      });
      setLoading(false);
      return;
    }

    // 일반 사용자 처리
    if (uId) {
      console.log("[UserProvider] 일반 사용자 로그인 복원 시도");
      axios
        .get(`/api/user/myinfo`, { // {uId}부분을 myinfo로 변경함 => token 에서 uId 추출해서 "그 사용자 정보"만 반환 -> 보안 상 URL 노출 방지 목적
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("[UserProvider] 사용자 이름 가져오기 성공:", res.data.uName);
          const uName = res.data.uName;
          setUser({
            id: uId,
            name: uName,
            token,
            role: "USER",
            type: "user",
          });
        })
        .catch((err) => {
          console.error("[UserProvider] 사용자 정보 불러오기 실패:", err.response?.data || err.message);
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("uId");
          sessionStorage.removeItem("role");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // 로그인 함수 (로그인 시 호출)
  const loginUser = ({ id, token, role = "USER", type = "user" }) => {
    setUser({
      id,
      name: null, // 이름은 다시 불러올 수도 있음
      token,
      role,
      type,
    });

    // 로컬 스토리지에 저장
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("role", role);

    if (type === "admin") {
      sessionStorage.setItem("aId", id);
    } else {
      sessionStorage.setItem("uId", id);
    }

    setLoading(false);
  };

  // 로그아웃 함수
  const logoutUser = () => {
    const provider = sessionStorage.getItem("loginProvider");

    setUser(null);
    setLoading(false);

    // 세션 스토리지 정리
    sessionStorage.setItem("justLoggedOut", "true");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("uId");
    sessionStorage.removeItem("aId");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("loginProvider");

    const googleRedirect = import.meta.env.VITE_GOOGLE_LOGOUT_REDIRECT_URI;
    const kakaoRedirect = import.meta.env.VITE_KAKAO_LOGOUT_REDIRECT_URI;

    // 로그아웃 후 분기 처리
    if (provider === "google") {
      // Google 로그아웃 (2단계 리다이렉션)
      const url = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${encodeURIComponent(googleRedirect)}`;
      window.location.href = url;
    } else if (provider === "kakao") {
      // Kakao 로그아웃
      const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
      const url = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${encodeURIComponent(kakaoRedirect)}`;
      window.location.href = url;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);