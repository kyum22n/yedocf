import BannerSection from "@/components/common/BannerSection";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import { banner3 } from '@/assets/cdnImages';
import Spacer from "@/components/common/Spacer";

import React, { useState } from 'react';
import Modal from "@/components/common/Modal";

// NOTE: 확정된 docs/api-contract.md에는 아이디/비밀번호 찾기 엔드포인트가 없음.
// 백엔드에 해당 API가 추가되기 전까지는 안내 메시지만 표시한다.
const FindAccountPage = () => {
    // 아이디 찾기용 state
    const [email, setEmail] = useState(""); // 아이디 찾기용 이메일 입력값
    const [foundId, setFoundId] = useState(""); // 아이디 찾기 결과 저장용
    const [showModal, setShowModal] = useState(false); // 모달 열림 여부

    // 비밀번호 찾기용 state
    const [id, setId] = useState(""); // 비번 찾기용 userId
    const [foundPassword, setFoundPassword] = useState(""); // 비번 찾기용 결과 (임시 비밀번호)

    const handleFindId = () => {
        if (!email) {
            alert("이메일을 입력하세요.");
            return;
        }
        alert("아이디 찾기 기능은 현재 지원되지 않습니다. 고객센터로 문의해주세요.");
    };

    const handleFindPassword = () => {
        if (!id) {
            alert("아이디를 입력하세요.");
            return;
        }
        alert("비밀번호 찾기 기능은 현재 지원되지 않습니다. 고객센터로 문의해주세요.");
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
