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
import { formatDateTime, formatToISODateTime } from "@/constants/dateUtils";

import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const NoticeEventManagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("NOTICE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const typeOptions = [
    { value: "NOTICE", label: "공지사항" },
    { value: "EVENT", label: "이벤트" },
  ];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axiosInstance.get("/admin/notices/all");
      setNotices(res.data);
    } catch (error) {
      console.error("공지사항/이벤트 목록 조회 실패", error);
    }
  };

  const handleCreateNotice = async () => {
    await axiosInstance.post("/admin/notices/register", {
      title,
      content,
      imageUrl,
      noticeType: type,
      isVisible: true,
      startAt: formatToISODateTime(startDate),
      endAt: formatToISODateTime(endDate),
      createdBy: sessionStorage.getItem("aId"),
    });

    await fetchNotices();
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateNotice = async () => {
    await axiosInstance.put(`/admin/notices/update`, {
      noticeId: selectedNotice.noticeId,
      title: selectedNotice.title,
      content: selectedNotice.content,
      imageUrl: selectedNotice.imageUrl,
      noticeType: selectedNotice.noticeType,
      isVisible: selectedNotice.isVisible ?? true,
      startAt: formatToISODateTime(selectedNotice.startAt),
      endAt: formatToISODateTime(selectedNotice.endAt),
    });
    await fetchNotices();
    setIsEditModalOpen(false);
  };

  const handleDeleteNotice = async () => {
    await axiosInstance.delete(`/admin/notices/delete/${selectedNotice.noticeId}`);
    await fetchNotices();
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setStartDate("");
    setEndDate("");
    setType("NOTICE");
  };

  return (
    <div className="flex">
      <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">공지사항/이벤트 관리</h1>

        <div className="flex mb-4 justify-end gap-4">
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
                <tr className="text-center" key={n.noticeId}>
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{n.title}</td>
                  <td className="px-4 py-2 border">{n.content}</td>
                  <td className="px-4 py-2 border">{n.imageUrl}</td>
                  <td className="px-4 py-2 border">{formatDateTime(n.startAt)} ~ {formatDateTime(n.endAt)}</td>
                  <td className="px-4 py-2 border">{n.noticeType}</td>
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
          <InputField name="title" placeholder="제목" variant="admin" className="p-2" value={selectedNotice?.title || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, title: e.target.value }))} />
          <InputField name="content" placeholder="내용" variant="admin" className="p-2" value={selectedNotice?.content || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, content: e.target.value }))} />
          <InputField name="imageUrl" placeholder="이미지 URL" variant="admin" className="p-2" value={selectedNotice?.imageUrl || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, imageUrl: e.target.value }))} />
          <InputField name="startAt" type="date" variant="admin" className="p-2" value={selectedNotice?.startAt || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, startAt: e.target.value }))} />
          <InputField name="endAt" type="date" variant="admin" className="p-2" value={selectedNotice?.endAt || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, endAt: e.target.value }))} />
          <Dropdown value={selectedNotice?.noticeType || ""} onChange={(e) => setSelectedNotice(prev => ({ ...prev, noticeType: e.target.value }))} options={typeOptions} className="p-2" />
        </Modal>

        {/* 삭제 모달 */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="게시글 삭제" actionLabel="삭제" onAction={handleDeleteNotice}>
          <p className="text-sm text-gray-700">게시글 <strong>{selectedNotice?.title}</strong> 을(를) 삭제하시겠습니까?</p>
        </Modal>
      </main>
    </div>
  );
};

export default NoticeEventManagePage;
