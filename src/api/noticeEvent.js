/**
 * packageName    : src.api.noticeEvent
 * fileName       : noticeEvent.js
 * author         : jkw
 * date           : 25.06.11
 * description    : 공지사항 및 이벤트 관리자 API 전용
 * ===========================================================
 */

import axiosInstance from "./axiosInstance";
import publicAxios from "./publicAxios";  // 요거 새로 추가

// 사용자 조회 (공개 API)
export const getAllNoticeEvents = async () => {
    const response = await publicAxios.get(`/api/noticeEvent`);

    return response.data;
};

// 관리자 등록 (인증 필요)
export const createNoticeEvent = async (data) => {
    const response = await axiosInstance.post(`/api/admin/noticeEvent`, data);
    return response.data;
};



// 25.06.16 추가

//상세 조회(관리자)
export const getNoticeEventById = async (neId) => {
    const response = await axiosInstance.get(`/api/admin/noticeEvent/${neId}`);
    return response.data;
};

//상세 조회(사용자)
export const getNoticeEventByIdUser = async (neId) => {
    const response = await fetch(`/api/noticeEvent/${neId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`조회실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

// 수정(관리자)
export const updateNoticeEvent = async (neId, form, token) => {
    await axiosInstance.put(`/admin/noticeEvent/${neId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 삭제(관리자)
export const deleteNoticeEvent = async (neId, token) => {
    await axiosInstance.delete(`/admin/noticeEvent/${neId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};