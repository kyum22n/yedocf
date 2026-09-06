
// 25.06.16 추가
import React, { useEffect, useState } from "react";
import { getNoticeEventById, updateNoticeEvent, deleteNoticeEvent } from "../../api/noticeEvent";
import { useParams, useNavigate } from "react-router-dom";

const NoticeEventEditPage = () => {
    const { neId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        neTitle: "",
        neContent: "",
        neImageUrl: "",
        neType: "NOTICE",
        neStartDate: "",
        neEndDate: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getNoticeEventById(neId);
            setForm(data);
        };
        fetchData();
    }, [neId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        const token = sessionStorage.getItem("token");
        await updateNoticeEvent(neId, form, token);
        alert("수정 완료");
        navigate("/admin/noticeevent");
    };

    const handleDelete = async () => {
        const token = sessionStorage.getItem("token");
        await deleteNoticeEvent(neId, token);
        alert("삭제 완료");
        navigate("/admin/noticeevent");
    };

    return (
        <div>
            <h2>공지사항 수정</h2>
            <input name="neTitle" value={form.neTitle} onChange={handleChange} />
            <input name="neContent" value={form.neContent} onChange={handleChange} />
            <input name="neImageUrl" value={form.neImageUrl} onChange={handleChange} />
            <select name="neType" value={form.neType} onChange={handleChange}>
                <option value="NOTICE">공지</option>
                <option value="EVENT">이벤트</option>
            </select>
            <input name="neStartDate" type="date" value={form.neStartDate} onChange={handleChange} />
            <input name="neEndDate" type="date" value={form.neEndDate} onChange={handleChange} />

            <button onClick={handleUpdate}>수정하기</button>
            <button onClick={handleDelete}>삭제하기</button>
        </div>
    );
};

export default NoticeEventEditPage;
