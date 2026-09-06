import BannerSection from "@/components/common/BannerSection";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import { banner3 } from '@/assets/cdnImages';
import Spacer from "@/components/common/Spacer";

// 추가함 / import useState, Modal, axios
import React, { useState } from 'react';
import Modal from "@/components/common/Modal"; // Modal import 추가
import axios from "axios"; // axios import

const FindAccountPage = () => {
    // API 기본 URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // 아이디 찾기용 state
    const [email, setEmail] = useState(""); // 아이디 찾기용 이메일 입력값
    const [foundId, setFoundId] = useState(""); // 아이디 찾기 결과 저장용
    const [showModal, setShowModal] = useState(false); // 모달 열림 여부

    // 비밀번호 찾기용 state
    const [id, setId] = useState(""); // 비번 찾기용 userId
    const [foundPassword, setFoundPassword] = useState(""); // 비번 찾기용 결과 (임시 비밀번호)

    // 아이디 찾기 요청
    const handleFindId = async () => {
        if (!email) {
            alert("이메일을 입력하세요.");
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/api/user/find_id`, { uEmail: email });
            console.log("아이디 찾기 응답:", response.data);
            setFoundId(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("아이디 찾기 오류:", error);
            alert("아이디를 찾을 수 없습니다. 입력한 이메일을 확인해주세요.");
        }
    };
        // 비밀번호 찾기 요청
        const handleFindPassword = async () => {
        if (!id) {
            alert("아이디를 입력하세요.");
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/api/user/find_password`, {
                uId: id
            });

            console.log("임시 비밀번호:", response.data);
            setFoundPassword(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("비밀번호 찾기 오류:", error);
            alert("비밀번호를 찾을 수 없습니다. 입력한 정보를 확인해주세요.");
        }
    };

    return (
        <div>
            <BannerSection
                title="아이디 / 비밀번호 찾기"
                subtitle=""
                image={banner3}
                objectPosition="object-[50%_20%]"
            />
            <div className="relative z-20 bg-white">
                <Spacer />
                <div className="max-w-md mx-auto px-4 py-16 space-y-12">
                    {/* 아이디 찾기 */}
                    <section>
                        <h2 className="text-xl font-bold mb-6">아이디 찾기</h2>
                        <InputField
                            name="email"
                            value={email} // 추가
                            onChange={(e) => setEmail(e.target.value)} // 추가
                            placeholder="이메일을 입력해주세요"
                            className="mb-3 h-12"
                        />
                        <Button variant="primary" 
                        size='lg' 
                        className='w-full mt-2'
                        onClick={handleFindId} //추가
                        >
                            아이디 찾기
                        </Button>
                    </section>

                    {/* 비밀번호 찾기 */}
                    <section>
                        <h2 className="text-xl font-bold mb-6">비밀번호 찾기</h2>
                        <InputField
                            name="userId"
                            value={id} // 추가
                            onChange={(e) => setId(e.target.value)} // 추가
                            placeholder="아이디를 입력해주세요"
                            className="mb-3 h-12"
                        />
                        <Button 
                            variant="primary" 
                            size='lg' 
                            className='w-full mt-2'
                            onClick={handleFindPassword}
                        >
                            비밀번호 찾기
                        </Button>
                    </section>
                </div>
                <Spacer size="lg" />
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={foundId ? "아이디 찾기 결과" : "비밀번호 찾기 결과"}
                >
                    <div className="p-6">
                        {foundId && !foundPassword &&(
                            <>
                                <h3 className="text-lg font-bold mb-4">아이디 찾기 결과</h3>
                                <p className="text-center text-xl">{foundId}</p>
                            </>
                        )}

                        {foundPassword && (
                            <>
                                <h3 className="text-lg font-bold mb-4">임시 비밀번호</h3>
                                <p className="text-center text-xl">{foundPassword}</p>
                            </>
                        )}

                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4 mx-auto block"
                            onClick={() => {
                                setShowModal(false);
                                setFoundId("");
                                setFoundPassword("");
                            }}
                        >
                            닫기
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default FindAccountPage;
