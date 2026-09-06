import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserProvider';

import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import SocialButton from '@/components/common/SocialButton';
import { login_side } from '@/assets/cdnImages';

import axios from 'axios';

const LoginPage = () => {
    // 사용자 입력 상태
    const [uId, setUId] = useState('');
    const [uPwd, setUPwd] = useState('');

    // 소셜 로그인 플래그
    const [isSocialLogin, setIsSocialLogin] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useUser();

    // 로그인 성공 시 처리
    const handleLoginSuccess = (userId, token, provider) => {
        sessionStorage.setItem('accessToken', token);
        sessionStorage.setItem('uId', userId);
        sessionStorage.setItem('role', 'USER');
        sessionStorage.setItem('loginProvider', provider);

        loginUser({
            id: userId,
            name: null,
            token,
            role: 'USER',
            type: 'user',
        });

        navigate('/');
    };

    // 일반 로그인 처리
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/login', { uId, uPwd });
            const token = response.data.token;
            const userId = response.data.uId;

            if (!token) throw new Error('서버에서 토큰을 받지 못했습니다.');

            handleLoginSuccess(userId, token, 'default');
        } catch (error) {
            console.error('로그인 실패:', error);
            if (!isSocialLogin) {
                alert('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        }
    };

    // 구글 로그인 URL로 리디렉트
    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
        const scope = 'https://www.googleapis.com/auth/userinfo.email';

        // 로그인 제공자 정보 저장
        sessionStorage.setItem('loginProvider', 'google');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = authUrl;
    };

    // 카카오 로그인 URL로 리디렉트
    const handleKakaoLogin = () => {
        const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

        // 로그인 제공자 정보 저장
        sessionStorage.setItem('loginProvider', 'kakao');
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    // 소셜 로그인 리다이렉트 처리
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (!code) return;

        setIsSocialLogin(true);

        const provider = sessionStorage.getItem('loginProvider');
        let endpoint = null;

        if (provider === 'google') endpoint = '/api/oauth2/google';
        if (provider === 'kakao') endpoint = '/api/oauth2/kakao';

        if (!endpoint) return;

        axios.post(endpoint, null, { params: { code } })
            .then((res) => {
                const token = res.data?.accessToken;
                const userId = res.data?.uId;
                if (!token || !userId) throw new Error('응답에서 토큰 또는 사용자 ID 없음');
                handleLoginSuccess(userId, token, provider);
            })
            .catch((err) => {
                console.error(`${provider} 로그인 실패:`, err);
                if (err.response?.status === 401) {
                    alert(err.response?.data || '해당 이메일로 가입된 사용자가 없습니다. 회원가입이 필요합니다.');
                    navigate('/signup');
                } else {
                    alert(`${provider} 로그인 실패`);
                }
            });
    }, [location]);

    return (
        <div className="flex h-screen">
            {/* 좌측 이미지 */}
            <div className="w-1/2 hidden md:block">
                <img
                    src={login_side}
                    alt="로그인 이미지"
                    className="w-full h-full object-cover sticky"
                />
            </div>

            {/* 로그인 폼 */}
            <div className="w-full md:w-1/2 flex-center relative bg-white flex-col">
                <form className="w-[90%] max-w-sm z-10" onSubmit={handleLogin}>
                    <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

                    <InputField
                        label="아이디"
                        name="uId"
                        placeholder="아이디를 입력하세요"
                        value={uId}
                        onChange={(e) => setUId(e.target.value)}
                        className="mb-5 h-12"
                    />
                    <InputField
                        label="비밀번호"
                        name="uPwd"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={uPwd}
                        onChange={(e) => setUPwd(e.target.value)}
                        className="mb-5 h-12"
                    />

                    {/* 링크 */}
                    <div className="text-sm w-full flex justify-between mb-4">
                        <a href="/idpwfind" className="text-gray-600 hover:underline">
                            아이디/비밀번호 찾기
                        </a>
                        <a href="/signup" className="text-gray-600 hover:underline">
                            회원가입
                        </a>
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                        로그인
                    </Button>
                </form>

                {/* 소셜 로그인 버튼 */}
                <div className="flex justify-around mt-5 flex-col gap-2 w-[90%] max-w-sm">
                    <SocialButton platform="kakao" onClick={handleKakaoLogin} />
                    {/* <SocialButton platform="google" onClick={handleGoogleLogin} /> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
