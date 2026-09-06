import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 세션/쿠키 기반 인증 시 필요
});

export default api;
