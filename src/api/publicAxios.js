/**
 * packageName    : src.api
 * fileName       : publicAxios.js
 * author         : jkw
 * date           : 25.06.12
 * description    : 공지사항 및 이벤트 사용자 API 전용
 * ===========================================================
 */

import axios from "axios";

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

publicAxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default publicAxios;
