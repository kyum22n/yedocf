/**
 * packageName    : src.pages.admin
 * fileName       : NoticeEventManagePage.jsx
 * author         : jkw
 * date           : 25.06.10
 * description    : 공지사항/이벤트 관리 최종본
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { formatDate, formatDateTime, formatToISODateTime } from "@/constants/dateUtils";

import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";

const NoticeEventManagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("공지사항");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const typeOptions = [
    { value: "공지사항", label: "공지사항" },
    { value: "이벤트", label: "이벤트" },
  ];

  const searchOptions = [
    { value: "neId", label: "순번" },
    { value: "neTitle", label: "제목" },
    { value: "neContent", label: "내용" },
    { value: "neStartDate", label: "게시시작일" },
    { value: "neType", label: "구분" },
  ];

  const selectedLabel = searchOptions.find((opt) => opt.value === searchCategory)?.label;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const token = sessionStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get("/api/admin/noticeEvent", config);
    setNotices(res.data);
  };

  const handleCreateNotice = async () => {
    const token = sessionStorage.getItem("accessToken");
    await axiosInstance.post("/api/admin/noticeEvent", {
      neTitle: title,
      neContent: content,
      neImageUrl: imageUrl,
      neType: type,
      neStartDate: formatToISODateTime(startDate),
      neEndDate: formatToISODateTime(endDate),
    }, { headers: { Authorization: `Bearer ${token}` } });

    await fetchNotices();
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateNotice = async () => {

    const token = sessionStorage.getItem("accessToken");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.put(`/api/admin/noticeEvent/${selectedNotice.neId}`, {
      ...selectedNotice,
      neStartDate: formatToISODateTime(selectedNotice.neStartDate),
      neEndDate: formatToISODateTime(selectedNotice.neEndDate),
    },config);
    await fetchNotices();
    setIsEditModalOpen(false);
  };

  const handleDeleteNotice = async () => {

    const token = sessionStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`/api/admin/noticeEvent/${selectedNotice.neId}`, config);
    await fetchNotices();
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setStartDate("");
    setEndDate("");
    setType("공지사항");
  };

  return (
    <div className="flex">
      <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">공지사항/이벤트 관리</h1>

        {/* <div className="flex mb-4 justify-between items-center gap-4"> */}
        <div className="flex mb-4 justify-end gap-4">

          {/* <div className="flex gap-2">
            <Dropdown value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} options={searchOptions} className="h-10" />
            <div className="w-1/2">
              <InputField name="searchText" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                placeholder={searchCategory ? `${selectedLabel}을 입력하세요` : "검색할 항목 선택"} variant="admin" className="h-10" labelHidden={true} />
            </div>
            <Button variant="primary" className="h-10">검색</Button>
          </div> */}
          <Button variant="primary" className="h-10 bg-green-600" onClick={() => setIsModalOpen(true)}>새 게시물</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">순번</th>
                <th className="px-4 py-3 border">제목</th>
                <th className="px-4 py-3 border">내용</th>
                <th className="px-4 py-3 border">이미지</th>
                <th className="px-4 py-3 border">게시기간</th>
                <th className="px-4 py-3 border">구분</th>
                <th className="py-3 border">변경 / 삭제</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n, index) => (
                <tr className="text-center" key={n.neId}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{n.neTitle}</td>
                  <td className="px-4 py-2 border">{n.neContent}</td>
                  <td className="px-4 py-2 border">{n.neImageUrl}</td>
                  <td className="px-4 py-2 border">{formatDateTime(n.neStartDate)} ~ {formatDateTime(n.neEndDate)}</td>
                  <td className="px-4 py-2 border">{n.neType}</td>
                  <td className="py-2 border flex justify-center gap-2">
                    <Button variant="secondary" onClick={() => { setSelectedNotice(n); setIsEditModalOpen(true); }}>변경</Button>
                    <Button variant="danger" onClick={() => { setSelectedNotice(n); setIsDeleteModalOpen(true); }}>삭제</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 새 게시물 추가 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="새 게시물 추가" actionLabel="등록" resetOnClose={true} onAction={handleCreateNotice}>
          <InputField name="title" placeholder="제목" variant="admin" className="p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <InputField name="content" placeholder="내용" variant="admin" className="p-2" value={content} onChange={(e) => setContent(e.target.value)} />
          <InputField name="imageUrl" placeholder="이미지 URL" variant="admin" className="p-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <InputField name="startDate" type="date" variant="admin" className="p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <InputField name="endDate" type="date" variant="admin" className="p-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Dropdown value={type} onChange={(e) => setType(e.target.value)} options={typeOptions} className="p-2" />
        </Modal>

        {/* 수정 모달 */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="게시글 변경" actionLabel="수정" resetOnClose={true} onAction={handleUpdateNotice}>
          <InputField name="neTitle" placeholder="제목" variant="admin" className="p-2" value={selectedNotice?.neTitle || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neTitle: e.target.value }))} />
          <InputField name="neContent" placeholder="내용" variant="admin" className="p-2" value={selectedNotice?.neContent || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neContent: e.target.value }))} />
          <InputField name="neImageUrl" placeholder="이미지 URL" variant="admin" className="p-2" value={selectedNotice?.neImageUrl || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neImageUrl: e.target.value }))} />
          <InputField name="neStartDate" type="date" variant="admin" className="p-2" value={selectedNotice?.neStartDate || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neStartDate: e.target.value }))} />
          <InputField name="neEndDate" type="date" variant="admin" className="p-2" value={selectedNotice?.neEndDate || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neEndDate: e.target.value }))} />
          <Dropdown value={selectedNotice?.neType || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, neType: e.target.value }))} options={typeOptions} className="p-2" />
        </Modal>

        {/* 삭제 모달 */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="게시글 삭제" actionLabel="삭제" onAction={handleDeleteNotice}>
          <p className="text-sm text-gray-700">게시글 <strong>{selectedNotice?.neTitle}</strong> 을(를) 삭제하시겠습니까?</p>
        </Modal>
      </main>
    </div>
  );
};

export default NoticeEventManagePage;
