
// 25.06.16 추가
import React, { useEffect, useState } from "react";
import { getNoticeEventById, updateNoticeEvent, deleteNoticeEvent } from "../../api/noticeEvent";
import { useParams, useNavigate } from "react-router-dom";

const NoticeEventEditPage = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        imageUrl: "",
        noticeType: "NOTICE",
        isVisible: true,
        startAt: "",
        endAt: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getNoticeEventById(noticeId);
            setForm(data);
        };
        fetchData();
    }, [noticeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        await updateNoticeEvent({ ...form, noticeId });
        alert("수정 완료");
        navigate("/admin/noticeManage");
    };

    const handleDelete = async () => {
        await deleteNoticeEvent(noticeId);
        alert("삭제 완료");
        navigate("/admin/noticeManage");
    };

    return (
        <div>
            <h2>공지사항 수정</h2>
            <input name="title" value={form.title} onChange={handleChange} />
            <input name="content" value={form.content} onChange={handleChange} />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
            <select name="noticeType" value={form.noticeType} onChange={handleChange}>
                <option value="NOTICE">공지</option>
                <option value="EVENT">이벤트</option>
            </select>
            <input name="startAt" type="date" value={form.startAt} onChange={handleChange} />
            <input name="endAt" type="date" value={form.endAt} onChange={handleChange} />

            <button onClick={handleUpdate}>수정하기</button>
            <button onClick={handleDelete}>삭제하기</button>
        </div>
    );
};

export default NoticeEventEditPage;
