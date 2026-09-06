/**
 * packageName    : src.constants
 * fileName       : dateUtils.js
 * author         : lkm
 * date           : 25.06.16
 * description    : 날짜 형식 지정
 * ===========================================================
 */

export const formatDateTime = (isoString) => {
    // ISO 형식의 문자열을 "YYYY-MM-DD HH:mm:ss" 형식으로 변환
    if (!isoString) return "";

    const date = new Date(isoString);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};

export const formatToISODateTime = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("T")) return dateStr;
    return `${dateStr}T00:00:00`;
};


export const formatDate = (dateStr) => {
    // 문자열을 "YYYY-MM-DD" 형식으로 변환
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}`;
};