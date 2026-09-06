import { wonjang3 } from '@/assets/cdnImages';

const DoctorSection = () => {
    return (
        <section className="h-[800px] flex items-center justify-center font-[SeoulHangangM]">
            <div className="bg-blue-100 w-1/2 h-full overflow-hidden relative">
                <div
                    style={{
                        backgroundImage: `url(${wonjang3})`,
                        backgroundSize: "135%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "50% 100%",
                        height: "100%",
                        width: "100%",
                    }}
                />
                <div className='absolute bottom-0 left-0 w-full h-48 flex justify-center items-center'
                    style={{
                        background: "linear-gradient(0deg,rgba(79, 79, 79, 1) 0%, rgba(153, 153, 153, 0.56) 50%, rgba(253, 187, 45, 0) 100%)"
                    }}>
                    <div className='w-full text-3xl text-white text-shadow p-10'>
                        <p className='text-left'>“ 아름다움과 기술을 위한 노력을</p>
                        <p className='text-right'>멈추지 않겠습니다. ”</p>
                    </div>
                </div>
            </div>
            <div className="w-1/2 h-full p-24">
                <h2 className="text-3xl text-right">연세 BT 미래병원 대표원장</h2>
                <h2 className="text-5xl font-bold text-right mt-4">박연세</h2>
                <div className="mt-12 text-xl">
                    <p className='mb-10'>
                        前 삼성서울병원 성형외과 전임의<br />
                        前 강남 메디컬 성형외과 원장<br />
                        現 연세 BT 미래병원 대표원장
                    </p>
                    <p className='mb-10'>
                        연세대학교 의과대학 졸업<br />
                        연세대학교 의과대학 대학원 석사<br />
                        대한 성형외과학회 정회원<br />
                        대한 미용성형학회 정회원<br />
                        대한 레이저학회 정회원
                    </p>
                    <p>
                        국제 성형외과 학술대회 연자<br />
                        국내 유명 성형외과 자문 및 교육 활동<br />
                        의료 미디어 출연 및 성형 관련 칼럼 기고
                    </p>
                </div>
            </div>
        </section>
    )
}

export default DoctorSection;