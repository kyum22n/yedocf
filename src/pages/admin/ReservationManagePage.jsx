/**
 * packageName    : src.pages.admin
 * fileName       : ReservationManagePage.jsx
 * author         : jkw
 * date           : 25.06.10
 * description    : 예약 관리 - 관리자 페이지
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TimeSelectorSelect from "@/components/admin/TimeSelectorSelect";
import { useState, useEffect } from "react";
import axios from "axios";

/**
 * packageName    : src.api.noticeEvent
 * fileName       : ReservationManagePage.jsx
 * author         : lkm
 * date           : 25.06.11
 * description    : 403 오류 해결
 * ===========================================================
 */

const ReservationManagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const [userId, setUserId] = useState("");
  const [procedure, setProcedure] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");

  const procedureOptions = [
    { value: "눈 성형", label: "눈 성형" },
    { value: "코 성형", label: "코 성형" },
    { value: "윤곽", label: "윤곽" },
  ];

  const statusOptions = [
    { value: "대기", label: "대기" },
    { value: "확정", label: "확정" },
    { value: "취소", label: "취소" },
  ];

  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const searchOptions = [
    { value: "id", label: "예약 ID" },
    { value: "userId", label: "예약자 아이디" },
    { value: "procedure", label: "시술 항목" },
    { value: "date", label: "예약 날짜" },
    { value: "time", label: "시간대" },
    { value: "status", label: "예약 상태" },
  ];

  const selectedLabel = searchOptions.find((opt) => opt.value === searchCategory)?.label;

  useEffect(() => {
    // 토큰 가져오기
    const token = sessionStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // API 호출해서 예약 목록 가져오기
    axios.get("/api/admin/reserve/reserves", config).then((res) => {
      // rId로 키 명시
      const mapped = res.data.map((r) => ({
        ...r,
        rId: r.rId,
      }));
      setReservations(mapped);
    });
  }, []);

  const handleStatusChange = (rId, status) => {
    // 토큰 가져오기
    const token = sessionStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // API 호출해서 예약 상태 변경
    axios
      .post(`/api/admin/reserve/${rId}/status`, { status }, config)
      .then(() => {
        setReservations(
          reservations.map((r) => (r.rId === rId ? { ...r, status } : r))
        );
      });
  };

  const handleDeleteReservation = () => {
    // 토큰 가져오기
    const token = sessionStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // API 호출해서 예약 삭제
    axios
      .post(`/api/admin/reserve/delete/${selectedReservation.rId}`, {}, config)
      .then(async () => {
        // 예약 목록 업데이트
        const res = await axios.get("/api/admin/reserve/reserves", config);
        setReservations(res.data);
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.log("예약 삭제 실패: ", error);
      });
  };

  const resetForm = () => {
    setUserId("");
    setProcedure("");
    setSelectedDate("");
    setSelectedTime("");
    setStatus("");
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      <Sidebar isLoggedIn={true} isSuperAdmin={true} adminName="최고관리자" />

      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">예약 관리</h1>

        {/* 검색 영역 */}
        {/* <div className="flex mb-4 justify-between items-center gap-4"> */}
        <div className="flex mb-4 justify-end gap-4">

          {/* <div className="flex gap-2">
            <Dropdown
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              options={searchOptions}
              className="h-10"
            />
            <div className="w-1/2">
              <InputField
                name="searchText"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={
                  searchCategory
                    ? `${selectedLabel}을(를) 입력하세요`
                    : "검색할 항목을 먼저 선택하세요"
                }
                variant="admin"
                className="h-10"
                labelHidden={true}
              />
            </div>
            <Button variant="primary" className="h-10">
              검색
            </Button>
          </div> */}

          <Button
            variant="primary"
            className="h-10 bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            예약 추가
          </Button>
        </div>

        {/* 예약 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm font-semibold">
                <th className="px-4 py-3 border">예약 ID</th>
                <th className="px-4 py-3 border">예약자 아이디</th>
                <th className="px-4 py-3 border">시술 항목</th>
                <th className="px-4 py-3 border">예약 날짜</th>
                <th className="px-4 py-3 border">시간대</th>
                <th className="px-4 py-3 border">예약 상태</th>
                <th className="py-3 border">변경 / 삭제</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr className="text-center" key={r.rId}>
                  <td className="px-4 py-2 border">{r.rId}</td>
                  <td className="px-4 py-2 border">{r.uId}</td>
                  <td className="px-4 py-2 border">{r.tName}</td>
                  <td className="px-4 py-2 border">{r.consultDate?.slice(0, 10)}</td>
                  <td className="px-4 py-2 border">{r.consultTime}</td>
                  <td className="px-4 py-2 border">
                    <select
                      className="border p-1"
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r.rId, e.target.value)
                      }
                    >
                      <option value="대기">대기</option>
                      <option value="확정">확정</option>
                      <option value="취소">취소</option>
                    </select>
                  </td>
                  <td className="py-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedReservation(r);
                          setIsEditModalOpen(true);
                        }}
                      >
                        변경
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          console.log("선택된 예약:", r);
                          setSelectedReservation(r);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div> {/* 예약 테이블 끝 */}

        {/* 예약 추가 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="예약 추가"
          actionLabel="추가"
          resetOnClose={true}
          onAction={async () => {
            try {
              const token = sessionStorage.getItem("accessToken");
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              const response = await axios.post(
                "/api/admin/reserve",
                {
                  uId: userId,
                  tName: procedure,
                  consultDate: selectedDate,
                  consultTime: selectedTime,
                  status: status,
                },
                config
              );

              console.log("예약 추가 성공: ", response.data);

              // 예약 목록 업데이트
              const res = await axios.get("/api/admin/reserve/reserves", config);
              setReservations(res.data);
              setIsModalOpen(false);
              resetForm();
            } catch (err) {
              console.error("예약 추가 실패:", err);
            }
          }}
        >
          <InputField
            name="userId"
            placeholder="예약자 아이디"
            variant="admin"
            className="p-2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Dropdown
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            options={[
              { value: "콧대 성형", label: "콧대 성형" },
              { value: "매부리코 성형", label: "매부리코 성형" },
              { value: "복코 교정", label: "복코 교정" },
              { value: "코끝 성형", label: "코끝 성형" },
              { value: "콧볼 축소", label: "콧볼 축소" },
              { value: "쌍커풀 수술", label: "쌍커풀 수술" },
              { value: "비절개 쌍커풀 수술", label: "비절개 쌍커풀 수술" },
              { value: "앞트임 수술", label: "앞트임 수술" },
              { value: "뒤트임 수술", label: "뒤트임 수술" },
              { value: "밑트임 수술", label: "밑트임 수술" },
              { value: "눈매 교정 수술", label: "눈매 교정 수술" },
              { value: "지방 재배치 수술", label: "지방 재배치 수술" },
              { value: "다크서클 제거", label: "다크서클 제거" },
              { value: "광대축소 수술", label: "광대축소 수술" },
              { value: "사각턱 수술", label: "사각턱 수술" },
              { value: "V라인 턱끝 성형수술", label: "V라인 턱끝 성형수술" },
              { value: "양악수술", label: "양악수술" },
              { value: "이중턱 지방흡입", label: "이중턱 지방흡입" },
            ]}
            className="p-2"
          />
          <InputField
            name="date"
            type="date"
            variant="admin"
            className="p-2"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
          />
          <TimeSelectorSelect
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            className="p-2"
            labelHidden={true}
          />
          <Dropdown
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            className="p-2"
          />
        </Modal>

        {/* 예약 삭제 모달 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="예약 삭제"
          actionLabel="삭제"
          onAction={handleDeleteReservation}
        >
          <p className="text-sm text-gray-700">
            예약자 <strong>{selectedReservation?.uId}</strong>의 예약을
            삭제하시겠습니까?
          </p>
        </Modal>

        {/* 예약 수정 모달 */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="예약 변경"
          actionLabel="변경"
          resetOnClose={true}
          onAction={async () => {
            try {
              const token = sessionStorage.getItem("accessToken");

              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              await axios.post(`/api/admin/reserve/${selectedReservation.rId}`, {
                rId: selectedReservation.rId,
                uId: selectedReservation.uId,
                tName: selectedReservation.tName,
                consultDate: selectedReservation.consultDate,
                consultTime: selectedReservation.consultTime,
                status: selectedReservation.status,
              }, config);

              const updatedList = await axios.get("/api/admin/reserve/reserves", config);
              setReservations(updatedList.data);
              setIsEditModalOpen(false);
            } catch (err) {
              console.error("예약 변경 실패:", err);
            }
          }}
        >
          <InputField
            name="userId"
            placeholder="예약자 아이디"
            variant="admin"
            className="p-2"
            value={selectedReservation?.uId || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                uId: e.target.value,
              }))
            }
          />
          <Dropdown
            value={selectedReservation?.tName || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                tName: e.target.value,
              }))
            }
            options={[
              { value: "콧대 성형", label: "콧대 성형" },
              { value: "매부리코 성형", label: "매부리코 성형" },
              { value: "복코 교정", label: "복코 교정" },
              { value: "코끝 성형", label: "코끝 성형" },
              { value: "콧볼 축소", label: "콧볼 축소" },
              { value: "쌍커풀 수술", label: "쌍커풀 수술" },
              { value: "비절개 쌍커풀 수술", label: "비절개 쌍커풀 수술" },
              { value: "앞트임 수술", label: "앞트임 수술" },
              { value: "뒤트임 수술", label: "뒤트임 수술" },
              { value: "밑트임 수술", label: "밑트임 수술" },
              { value: "눈매 교정 수술", label: "눈매 교정 수술" },
              { value: "지방 재배치 수술", label: "지방 재배치 수술" },
              { value: "다크서클 제거", label: "다크서클 제거" },
              { value: "광대축소 수술", label: "광대축소 수술" },
              { value: "사각턱 수술", label: "사각턱 수술" },
              { value: "V라인 턱끝 성형수술", label: "V라인 턱끝 성형수술" },
              { value: "양악수술", label: "양악수술" },
              { value: "이중턱 지방흡입", label: "이중턱 지방흡입" },
            ]}
            className="p-2"
          />
          <InputField
            name="date"
            type="date"
            variant="admin"
            className="p-2"
            value={selectedReservation?.consultDate || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                consultDate: e.target.value,
                consultTime: "",
              }))
            }
          />
          <TimeSelectorSelect
            selectedDate={selectedReservation?.consultDate || ""}
            selectedTime={selectedReservation?.consultTime || ""}
            onSelect={(newTime) =>
              setSelectedReservation((prev) => ({
                ...prev,
                consultTime: newTime,
              }))
            }
            className="p-2"
            labelHidden={true}
          />
          <Dropdown
            value={selectedReservation?.status || ""}
            onChange={(e) =>
              setSelectedReservation((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            options={statusOptions}
            className="p-2"
          />
        </Modal>
      </main>
    </div>
  );
};

export default ReservationManagePage;
