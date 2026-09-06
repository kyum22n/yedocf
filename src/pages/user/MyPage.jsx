import { useState, useEffect } from "react";
import BannerSection from "@/components/common/BannerSection";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Spacer from "@/components/common/Spacer";
import { formatDateTime } from "@/constants/dateUtils";
import { banner2 } from '@/assets/cdnImages';
import axios from "axios";
import { useUser } from "@/contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();

    // 로그인 안 된 상태면 로그인 페이지로 보내기
    useEffect(() => {
        const justLoggedOut = sessionStorage.getItem("justLoggedOut");

        if (!user) {
            if (justLoggedOut === "true") {
                sessionStorage.removeItem("justLoggedOut");
                navigate("/");
            } else {
                alert("로그인이 필요합니다. 다시 로그인해주세요.");
                navigate("/login");
            }
        }
    }, [user, navigate]);

    // 관리자 접근 차단 (마이페이지)
    if (user?.type === "admin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h2 className="text-2xl font-bold mb-4">사용자를 위한 기능입니다</h2>
                <p className="text-gray-600">이 마이 페이지는 일반 사용자만 이용할 수 있습니다.</p>
                <button
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => window.history.back()}
                >
                    이전 페이지로
                </button>
            </div>
        );
    }

    const handleWithdraw = async () => {
        if (!window.confirm("정말 회원 탈퇴하시겠습니까?")) return;

        try {
            const token = sessionStorage.getItem("accessToken");
            const uId = sessionStorage.getItem("uId");

            await axios.post(`/api/user/Delete/${uId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("회원 탈퇴가 완료되었습니다.");
            logoutUser(); // 유저 상태 초기화
            window.location.href = "/login"; // 로그인 페이지로 보냄
        } catch (err) {
            console.error("회원 탈퇴 실패 : ", err);
            alert("회원 탈퇴 중 오류가 발생하였습니다.");
        }
    };

    // 모달 및 상태 관리
    const [userInfo, setUserInfo] = useState({ uName: "", uId: "", uEmail: "", uPhone: "" }); // 사용자 정보

    const [showPwdModal, setShowPwdModal] = useState(false); // 비밀번호 변경 모달 표시 여부
    const [oldPwd, setOldPwd] = useState(""); // 기존 비밀번호 입력값
    const [newPwd, setNewPwd] = useState(""); // 새 비밀번호 입력값
    const [confirmPwd, setConfirmPwd] = useState(""); // 비밀번호 확인 입력값

    const [showPhoneModal, setShowPhoneModal] = useState(false); // 전화번호 변경 모달 표시 여부
    const [newPhone, setNewPhone] = useState(""); // 전화번호 변경 입력 값

    const [reservations, setReservations] = useState([]); // 예약 내역

    const [inquiries, setInquiries] = useState([]); // 문의 내역
    const [selectedInquiry, setSelectedInquiry] = useState([]); // 선택된 문의
    const [showInquiryModal, setShowInquiryModal] = useState(false); // 문의 내용 상세보기 모달 표시 여부

    useEffect(() => {

        const token = sessionStorage.getItem("accessToken");
        const aId = sessionStorage.getItem("aId");
        const uId = sessionStorage.getItem("uId");
        const role = sessionStorage.getItem("role");

        if (!uId || !token) {
            // alert("로그인이 필요합니다. 다시 로그인해주세요.");
            console.error("로그인 정보가 없습니다.");
            return;
        }

        // 예약 내역 불러오기
        axios.get(`/api/reserve/${uId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setReservations(response.data);
            })
            .catch((error) => {
                console.error("예약 내역 조회 실패", error);
            });

        // 사용자 정보 불러오기
        axios.get(`/api/user/myinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.error("사용자 정보 조회 실패", error);
            });

        // 문의 내역 불러오기
        axios.get('/api/inquiry', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setInquiries(response.data);
            })
            .catch((error) => {
                console.error("문의 내역 조회 실패", error);
            });

    }, []);

    return (
        <>
            <BannerSection
                title="마이페이지"
                subtitle="회원 정보와 예약 내역을 확인하세요"
                image={banner2}
                objectPosition="object-[50%_20%]"
            />
            <div className="relative z-20 bg-white">
                <Spacer />
                <section className="max-w-4xl mx-auto p-8 space-y-10">
                    {/* 회원 정보 */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">회원 정보</h2>
                        <table className="w-full max-w-2xl text-sm">
                            <tbody>
                                <tr>
                                    <th className="text-left font-medium py-3 w-1/4">이름</th>
                                    <td className="py-3">{userInfo.uName}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th className="text-left font-medium py-3">아이디</th>
                                    <td className="py-3">{userInfo.uId}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th className="text-left font-medium py-3">비밀번호</th>
                                    <td className="py-3">●●●●●●</td>
                                    <td className="text-right">
                                        <Button variant="secondary" onClick={() => setShowPwdModal(true)}>변경</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-left font-medium py-3">이메일</th>
                                    <td className="py-3">{userInfo.uEmail}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th className="text-left font-medium py-3">전화번호</th>
                                    <td className="py-3">{userInfo.uPhone}</td>
                                    <td className="text-right">
                                        <Button variant="secondary" onClick={() => setShowPhoneModal(true)}>변경</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="test-right mt-4">
                            <Button variant="destructive" onClick={handleWithdraw}>회원 탈퇴</Button>
                        </div>
                    </div>
                    <Spacer />

                    {/* 예약 내역 */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">예약 내역</h2>
                        <table className="w-full border border-gray-300 text-center text-sm">
                            <thead className="bg-pink-100 text-gray-800">
                                <tr>
                                    <th className="p-2 border">예약 항목</th>
                                    <th className="p-2 border">예약 날짜</th>
                                    <th className="p-2 border">시간</th>
                                    <th className="p-2 border">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length === 0 ?
                                    (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-gray-500">예약 내역이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        reservations.map((r) => (
                                            <tr key={r.rId}>
                                                <td className="border p-2">{r.tName}</td>
                                                <td className="border p-2">{r.consultDate?.slice(0, 10)}</td>
                                                <td className="border p-2">{r.consultTime}</td>
                                                <td className="border p-2">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <span>{r.status}</span>
                                                        {(r.status === "예약됨" || r.status === "대기") && (
                                                            // 예약 취소 버튼
                                                            <Button
                                                                variant="secondary"
                                                                className="text-sm"
                                                                onClick={async () => {
                                                                    const token = sessionStorage.getItem("accessToken");

                                                                    try {
                                                                        await axios.post(`/api/reserve/${r.rId}/cancel`, null, {
                                                                            headers: {
                                                                                Authorization: `Bearer ${token}`,
                                                                            },
                                                                        });
                                                                        alert("예약이 취소되었습니다.");

                                                                        // 예약 목록 갱신
                                                                        setReservations((prev) =>
                                                                            prev.map((response) =>
                                                                                response.rId === r.rId ? { ...response, status: "취소 완료" } : response
                                                                            )
                                                                        );
                                                                    } catch (error) {
                                                                        console.error("예약 취소 실패", error);
                                                                        alert("예약 취소에 실패했습니다.");
                                                                    }
                                                                }}
                                                            >
                                                                취소하기
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {/* 문의 내역 */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">문의 내역</h2>
                        <table className="w-full border border-gray-300 text-center text-sm">
                            <thead className="bg-blue-100 text-gray-800">
                                <tr>
                                    <th className="p-2 border">문의 내용</th>
                                    <th className="p-2 border">작성일</th>
                                    <th className="p-2 border">처리 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-gray-500">문의 내역이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        inquiries.map((q) => (
                                            <tr key={q.qId}>

                                                <td
                                                    className="border p-2 text-blue-600 underline cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedInquiry(q);
                                                        setShowInquiryModal(true);
                                                    }}
                                                >
                                                    문의 내용 상세보기
                                                </td>
                                                <td className="border p-2">{formatDateTime(q.createdAt)}</td>
                                                <td className="border p-2">{q.qStatus}</td>

                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                </section>
                <Spacer size="lg" />
            </div>
            {/* 비밀번호 변경 모달 */}
            <Modal
                isOpen={showPwdModal}
                onClose={() => setShowPwdModal(false)}
                title="비밀번호 변경"
                actionLabel="변경"
                onAction={async () => {
                    if (!oldPwd || !newPwd || !confirmPwd) {
                        alert("모든 항목을 입력해주세요.");
                        return;
                    }

                    if (newPwd !== confirmPwd) {
                        alert("새 비밀번호가 일치하지 않습니다.");
                        return;
                    }

                    try {
                        const token = sessionStorage.getItem("accessToken");
                        const uId = sessionStorage.getItem("uId");

                        await axios.post("/api/user/password",
                            {
                                uId: uId,
                                oldPwd: oldPwd,
                                newPwd: newPwd,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        alert("비밀번호가 변경되었습니다.");
                        setShowPwdModal(false);
                        setOldPwd("");
                        setNewPwd("");
                        setConfirmPwd("");
                    } catch (error) {
                        console.error("비밀번호 변경 실패", error);
                        if (error.response && error.response.data) {
                            alert(`변경 실패: ${error.response.data}`);
                        } else {
                            alert("비밀번호 변경에 실패했습니다.");
                        }
                    }
                }}
            >
                <input
                    type="password"
                    placeholder="기존 비밀번호"
                    className="w-full border p-2 rounded mb-3"
                    value={oldPwd}
                    onChange={(e) => setOldPwd(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    className="w-full border p-2 rounded mb-3"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    className="w-full border p-2 rounded"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                />
            </Modal>

            {/* 전화번호 변경 모달 */}
            <Modal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                title="전화번호 변경"
                actionLabel="변경"
                onAction={async () => {
                    try {
                        const uId = sessionStorage.getItem("uId");
                        const token = sessionStorage.getItem("accessToken");

                        const response = await axios.post(
                            "/api/user/phone",
                            {
                                uId: uId,
                                uPhone: newPhone,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        alert("핸드폰 번호가 변경되었습니다.");

                        // 서버에서 최신 userInfo 다시 가져오기 = 실시간 변경
                        const updatedUserInfo = await axios.get(`/api/user/myinfo`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        setUserInfo(updatedUserInfo.data);

                        setShowPhoneModal(false);
                        setNewPhone("");
                    } catch (error) {
                        console.error("전화번호 변경 실패", error);
                        if (error.response && error.response.data) {
                            alert(`변경 실패: ${error.response.data}`);
                        } else {
                            alert("전화번호 변경에 실패했습니다.");
                        }
                    }
                }}
            >
                {/* [변경] 전화번호 입력창에 상태(newPhone) 바인딩 추가 (value, onChange) */}
                <input
                    type="tel"
                    placeholder="새 전화번호"
                    className="w-full border p-2 rounded"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                />
            </Modal>

            {/* 문의 내용 상세보기 모달 */}
            <Modal
                isOpen={showInquiryModal}
                onClose={() => setShowInquiryModal(false)}
                title="문의 상세 내용"
                actionLabel="닫기"
                onAction={() => setShowInquiryModal(false)}
            >
                {selectedInquiry && (
                    <div className="space-y-4 text-sm">
                        <div>
                            <strong>문의 내용</strong>
                            <div className="mt-1 p-2 border rounded bg-gray-50 whitespace-pre-wrap">
                                {selectedInquiry.qContent}
                            </div>
                        </div>

                    </div>
                )}
            </Modal>
        </>
    );
};

export default MyPage;
