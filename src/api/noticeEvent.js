/**
 * packageName    : src.api.noticeEvent
 * fileName       : noticeEvent.js
 * author         : jkw
 * date           : 25.06.11
 * description    : 공지사항 및 이벤트 API 전용
 * ===========================================================
 */

import axiosInstance from "./axiosInstance";

// 사용자 조회 (공개 API)
export const getAllNoticeEvents = async () => {
    const response = await axiosInstance.get(`/api/noticeEvent`);
    return response.data;
};

// 관리자 등록 (인증 필요)
export const createNoticeEvent = async (data) => {
    const response = await axiosInstance.post(`/api/admin/noticeEvent`, data);
    return response.data;
};

//상세 조회(관리자)
export const getNoticeEventById = async (neId) => {
    const response = await axiosInstance.get(`/api/admin/noticeEvent/${neId}`);
    return response.data;
};

//상세 조회(사용자)
export const getNoticeEventByIdUser = async (neId) => {
    const response = await axiosInstance.get(`/api/noticeEvent/${neId}`);
    return response.data;
};

// 수정(관리자)
export const updateNoticeEvent = async (neId, form) => {
    await axiosInstance.put(`/api/admin/noticeEvent/${neId}`, form);
};

// 삭제(관리자)
export const deleteNoticeEvent = async (neId) => {
    await axiosInstance.delete(`/api/admin/noticeEvent/${neId}`);
};
