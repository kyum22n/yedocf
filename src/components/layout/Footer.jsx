import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer" className="bg-gray-100 text-gray-800 py-7 text-sm">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className='text-right'>
                    <h2 className="text-lg font-bold mb-2">연세 BT 미래의원</h2>
                    <ul className="space-y-1">
                        <li>대표자: 박연세</li>
                        <li>사업자등록번호: 123-45-67890</li>
                        <li>주소: 서울특별시 강남구 테헤란로 123, 5층 (역삼동)</li>
                        <li>대표전화: 02-1234-5678</li>
                        <li>이메일: contact@btclinic.co.kr</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-2">진료시간</h2>
                    <ul className="space-y-1">
                        <li>월–금: 10:00 ~ 18:00</li>
                        <li>토요일: 10:00 ~ 15:00</li>
                        <li>일요일/공휴일 휴진</li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 border-t pt-4">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                    <Link to="/adminlogin" className="hover:underline">관리자 페이지로 가기</Link>
                </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
                © 2025 BT CLINIC. All Rights Reserved.
            </div>
            {/* <div className="text-center"><Link to="/adminlogin" className="text-gray-400 text-xs hover:underline">관리자페이지로 가기</Link></div> */}
        </footer>

    )
}

export default Footer;
// 이 컴포넌트는 웹사이트의 푸터 영역을 구성합니다.