import BannerSection from "@/components/common/BannerSection";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import Spacer from "@/components/common/Spacer";
import { banner1 } from '@/assets/cdnImages';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
    
    // API 기본 URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    const navigate = useNavigate();

    // 사용자 입력값 상태 정의
    const [form, setForm] = useState({
        name: "",
        userId: "",
        password: "",
        confirmPassword: "",
        email: "",
        emailCertificate: "",
        phone: "",
        termsAll: false,
        termsRequired1: false,
        termsRequired2: false,
        termsRequired3: false,
    });

    // 전화번호 자동 하이픈 포맷터
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length < 4) return numbers;
        if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    };

    // 입력 에러 메시지 상태
    const [formErrors, setFormErrors] = useState({});

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "termsAll") {
            // 전체 동의 시 필수 항목도 체크
            setForm((prev) => ({
                ...prev,
                termsAll: checked,
                termsRequired1: checked,
                termsRequired2: checked,
                termsRequired3: checked,
            }));
        } else {
            const formattedValue =
                name === "phone" ? formatPhoneNumber(value) : value;
            setForm((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : formattedValue,
            }));
        }
    };

    // 이메일 인증 관련 상태
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    // 인증번호 입력 처리
    const handleCertChange = (e) => {
        setForm((prev) => ({ ...prev, emailCertificate: e.target.value }));
    };

    // 타이머 상태 (180초)
    const [remainingTime, setRemainingTime] = useState(180);

    // 타이머 시작
    useEffect(() => {
        if (isEmailSent && remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isEmailSent, remainingTime]);

    // 타이머 형식 포맷
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // 입력값 유효성 검사
    const validateForm = () => {
        const errors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
        const emailRegex = /\S+@\S+\.\S+/;

        if (!form.name.trim())
            errors.name = "이름을 입력해주세요.";
        if (!form.userId.trim() || form.userId.length < 4 || form.userId.length > 20)
            errors.userId = "아이디는 4~20자 사이여야 합니다.";
        if (!passwordRegex.test(form.password))
            errors.password = "비밀번호는 영문+숫자+특수문자 조합 8자 이상이어야 합니다.";
        if (form.password !== form.confirmPassword)
            errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        if (!emailRegex.test(form.email))
            errors.email = "이메일 형식이 올바르지 않습니다.";
        if (!isVerified) {
            errors.email = "이메일 인증을 완료해주세요.";
        }
        if (!phoneRegex.test(form.phone))
            errors.phone = "전화번호 형식이 올바르지 않습니다.";
        if (!form.termsRequired1 || !form.termsRequired2)
            errors.terms = "필수 약관에 모두 동의해주세요.";
        return errors;
    };

    // 이메일 인증번호 요청 처리
    const handleEmailVerification = async () => {
        const emailRegex = /\S+@\S+\.\S+/;

        // 이메일 유효성 검사
        if (!form.email || !emailRegex.test(form.email)) {
            setFormErrors((prev) => ({
                ...prev,
                email: "이메일을 올바르게 입력한 후 인증을 요청해주세요.",
            }));
            return;
        }

        try {
            setEmailLoading(true); // 로딩 시작

            // 이메일로 인증 코드 전송 요청
            await axios.post("/api/user/send-code", { email: form.email });

            // 인증번호 입력값 초기화
            setForm((prev) => ({
                ...prev,
                emailCertificate: ""
            }));

            // 기존 인증 성공 상태 초기화 (재전송 시 다시 인증받아야 함)
            setIsVerified(false);

            // 관련 에러 메시지 제거 (이메일, 인증번호 에러 제거)
            setFormErrors((prev) => {
                const { emailCertificate, email, ...rest } = prev;
                return rest;
            });

            // 타이머 리셋 및 인증 플래그 재설정
            setRemainingTime(180);
            setIsEmailSent(true);

            alert("입력하신 이메일로 인증번호를 전송했습니다.");
        } catch (err) {
            alert("인증 코드 전송 실패");
        } finally {
            setEmailLoading(false); // 로딩 종료
        }
    };

    // 회원가입 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        try {
            await axios.post(`${baseUrl}/api/user/register`, {
                uId: form.userId,
                uPwd: form.password,
                uEmail: form.email,
                uName: form.name,
                uPhone: form.phone,
            });

            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data;

            if (typeof msg === 'string') {
                alert("회원가입 실패: " + msg);
            } else if (typeof msg === 'object') {
                const messages = Object.values(msg).join('\n');
                alert("회원가입 실패:\n" + messages);
            } else {
                alert("회원가입 실패: 서버 오류");
            }
        }
    };

    return (
        <div>
            {/* 상단 배너 */}
            <BannerSection
                title="회원가입"
                subtitle="연세 성형외과에 오신 걸 환영합니다"
                image={banner1}
                objectPosition="object-[50%_20%]"
            />
            <div className="relative z-20 bg-white">
                <Spacer />
                <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 space-y-10">
                    {/* 이름 입력 */}
                    <div>
                        <InputField name="name" placeholder="이름" value={form.name} onChange={handleChange} className="h-12" />
                        {formErrors.name && <p className="text-red-500 text-sm absolute">{formErrors.name}</p>}
                    </div>

                    {/* 아이디 입력 */}
                    <div>
                        <InputField name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} className="h-12" />
                        {formErrors.userId && <p className="text-red-500 text-sm absolute">{formErrors.userId}</p>}
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <InputField type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} className="h-12" />
                        {formErrors.password && <p className="text-red-500 text-sm absolute">{formErrors.password}</p>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <InputField type="password" name="confirmPassword" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} className="h-12" />
                        {formErrors.confirmPassword && <p className="text-red-500 text-sm absolute">{formErrors.confirmPassword}</p>}
                    </div>

                    {/* 이메일 입력 + 인증 버튼 */}
                    <div>
                        <div className="flex w-full items-center gap-1">
                            <div className="relative w-full">
                                <InputField type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} className="h-12" />
                            </div>
                            <Button type="button" variant="primary" onClick={handleEmailVerification} disabled={emailLoading}>{emailLoading ? "전송중입니다..." : "이메일 인증"}</Button>
                        </div>
                        {formErrors.email && <p className="text-red-500 text-sm absolute">{formErrors.email}</p>}
                    </div>

                    {/* 이메일 인증번호 입력 및 확인 */}
                    {isEmailSent && (
                        <div>
                            {/* 인증번호 입력 필드 + 확인 버튼 */}
                            <div className="flex w-full items-center gap-1">
                                <div className="relative w-full">
                                    {/* 인증번호 입력 필드 */}
                                    <InputField
                                        name="emailCertificate"
                                        placeholder="이메일 인증번호"
                                        value={form.emailCertificate}
                                        onChange={handleCertChange}
                                        className="h-12"
                                    />
                                </div>

                                {/* 인증번호 확인 버튼 */}
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={async () => {
                                        const newErrors = { ...formErrors };

                                        // 1. 타이머 만료 시 즉시 인증 실패 처리
                                        if (remainingTime <= 0) {
                                            newErrors.emailCertificate = "인증번호가 만료되었습니다.";
                                            setFormErrors(newErrors);
                                            setIsVerified(false);
                                            return;
                                        }

                                        // 2. 인증번호 미입력 시 에러 처리
                                        if (!form.emailCertificate.trim()) {
                                            newErrors.emailCertificate = "인증번호를 입력해주세요.";
                                            setFormErrors(newErrors);
                                            return;
                                        }

                                        try {
                                            // 3. 인증번호 검증 요청 (백엔드)
                                            const response = await axios.post("/api/user/verify-code", {
                                                email: form.email,
                                                code: form.emailCertificate,
                                            });

                                            const message = response.data;

                                            // 4. 백엔드 응답 메시지에 따른 분기 처리
                                            if (message === "인증 성공") {
                                                alert("인증이 완료되었습니다.");
                                                setIsVerified(true);
                                                const { emailCertificate, ...rest } = newErrors;
                                                setFormErrors(rest);
                                            } else if (message.includes("이미 가입")) {
                                                newErrors.emailCertificate = "이미 가입되어있는 이메일입니다.";
                                                setFormErrors(newErrors);
                                                setIsVerified(false);
                                            } else {
                                                newErrors.emailCertificate = message || "인증에 실패했습니다.";
                                                setFormErrors(newErrors);
                                                setIsVerified(false);
                                            }

                                        } catch (err) {
                                            // 5. 에러 응답 처리
                                            const serverMsg = err.response?.data;

                                            if (typeof serverMsg === "string" && serverMsg.includes("만료")) {
                                                newErrors.emailCertificate = "인증번호가 만료되었습니다.";
                                            } else if (typeof serverMsg === "string" && serverMsg.includes("이미 가입")) {
                                                newErrors.emailCertificate = "이미 가입되어있는 이메일입니다.";
                                            } else {
                                                newErrors.emailCertificate = "인증번호가 올바르지 않습니다.";
                                            }

                                            setFormErrors(newErrors);
                                            setIsVerified(false);
                                        }
                                    }}
                                >
                                    인증번호 확인
                                </Button>
                            </div>

                            {/* 인증 에러 메시지 및 타이머 표시 */}
                            <div className="flex items-center justify-between mt-2">
                                {/* 인증번호 에러 메시지 */}
                                {formErrors.emailCertificate && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formErrors.emailCertificate}
                                    </p>
                                )}
                                {/* 타이머 표시 (0초 이하이면 빨간색) */}
                                <p className={remainingTime <= 0 ? "text-red-500" : ""}>
                                    남은 시간 : {formatTime(remainingTime)}
                                </p>
                            </div>
                        </div>
                    )}
                    {/* 전화번호 입력 */}
                    <div>
                        <InputField type="tel" name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} className="h-12" />
                        {formErrors.phone && <p className="text-red-500 text-sm absolute">{formErrors.phone}</p>}
                    </div>

                    {/* 약관 체크박스 */}
                    <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="termsAll" checked={form.termsAll} onChange={handleChange} />
                            전체 약관 동의
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="termsRequired1" checked={form.termsRequired1} onChange={handleChange} />
                            [필수] 이용약관 동의
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="termsRequired2" checked={form.termsRequired2} onChange={handleChange} />
                            [필수] 개인정보 수집 및 이용 동의
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="termsRequired3" checked={form.termsRequired3} onChange={handleChange} />
                            [필수] 이메일 수신을 통한 알림 동의
                        </label>
                        {formErrors.terms && <p className="text-red-500 text-sm absolute">{formErrors.terms}</p>}
                    </div>

                    <Spacer size="xs" />

                    {/* 회원가입 버튼 */}
                    <Button type="submit" variant="primary" size="lg" className="w-full">
                        회원가입
                    </Button>

                    <Spacer size="lg" />
                </form>
            </div>
        </div>
    );
};

export default SignupPage;