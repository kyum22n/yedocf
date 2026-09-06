import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuItems } from '@/constants/menuItems';
import { useUser } from '@/contexts/UserProvider';

const Header = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();
    const { user, loading, logoutUser } = useUser();

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("uId");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("aId");
        logoutUser(null);

        // 소셜 로그아웃 추가 처리 (리디렉션 방식으로 할 수 있는 경우만)
        if (provider === "google") {
            // 서버에 토큰 revoke 또는 추가 처리하는 API가 있다면 여기에 axios.post() 가능
            console.log("Google 사용자 로그아웃 완료 (로컬 정리만 수행)");
        }

        navigate('/');
    };

    const getMenuLabel = (key) => {
        switch (key) {
            case 'eye': return '눈';
            case 'nose': return '코';
            case 'face': return '윤곽';
            case 'notice': return '공지사항';
            default: return key;
        }
    };

    const handleReservationClick = () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
        else {
            navigate('/reservation');
        }
    }


    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white shadow z-50 h-16">
                <div className="flex justify-between items-center relative">
                    {/* 로고 */}
                    <Link to="/">
                        <h1 className="text-xl font-bold h-16 px-4 flex items-center z-30 relative" title='연세 BT 미래병원'>
                            연세 BT 미래병원
                        </h1>
                    </Link>

                    {/* 네비게이션 */}
                    <nav className="absolute-center flex-center w-full">
                        <div className="flex gap-1 h-16 w-2/5 justify-between max-w-[1100px]">
                            <Link to="/?scrollTo=directions" className="h-16 text-lg font-bold flex-center whitespace-nowrap" title='오시는 길'>
                                오시는 길
                            </Link>
                            {Object.keys(menuItems).map((key) => (
                                <Link to={`/${key}`} key={key}>
                                    <button
                                        type="button"
                                        className="h-16  text-lg font-bold flex-center whitespace-nowrap"
                                        onMouseEnter={() => setActiveMenu(key)}
                                    >
                                        {getMenuLabel(key)}
                                    </button>
                                </Link>
                            ))}

                            <Link to="/notice" className="h-16 text-lg font-bold flex-center whitespace-nowrap" title='공지사항'>
                                공지사항
                            </Link>
                            <Link to="/inquiry" className="h-16 text-lg font-bold flex-center whitespace-nowrap" title='1:1 문의'>
                                1:1 문의
                            </Link>
                        <button
                            onClick={handleReservationClick}
                            type="button"
                            className="h-16 text-lg font-bold flex-center whitespace-nowrap" title='예약하기'
                        >
                            예약하기
                        </button>
                        </div>
                    </nav>

                    {/* 로그인 / 예약 */}
                    <div className="flex gap-2 items-center z-30 relative">
                        {!loading && (
                            user ? (
                                <>
                                    <Link to="/mypage" className="h-16 flex items-center p-3" title='마이페이지'>
                                        {user.id}님 안녕하세요
                                    </Link>
                                    <button onClick={handleLogout} className="h-12 flex items-center px-8 mr-3 border border-black hover:bg-pink-50" title='로그아웃'>
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="h-12 flex items-center px-8 mr-3 border border-black hover:bg-pink-50" title='로그인'>
                                    로그인
                                </Link>
                            )
                        )}
                    </div>
                </div >
            </header >

            {/* 서브메뉴 */}
            {
                activeMenu && (
                    <div
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                        className="fixed top-[60px] left-0 w-full max-h-60 overflow-y-auto bg-white shadow z-40 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    >
                        <ul className="flex justify-center gap-8 px-6">
                            {menuItems[activeMenu].map(({ title, tab }) => (
                                <li key={tab} className="hover:bg-slate-100 hover:underline py-1">
                                    <Link
                                        to={`/${activeMenu}?tab=${tab}`}
                                        className="h-12 px-4 flex-center text-sm whitespace-nowrap"
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </>
    );
};

export default Header;