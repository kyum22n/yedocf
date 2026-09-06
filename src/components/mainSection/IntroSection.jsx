import { useState } from "react";
import { consult, aftercare, doctor, surgery, study } from '@/assets/cdnImages';

const IntroSection = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [lastHoverIndex, setLastHoverIndex] = useState(0);

  const introItems = [
    { title: "풍부한 경력", desc: "연세대학교 의과대학 출신, 연세서울병원 전임의 출신", image: study, bgPos: "48%" },
    { title: "맞춤형 진료", desc: "개개인에 맞춘 상담과 정밀한 시술 제공", image: consult, bgPos: "80%" },
    { title: "다양한 전문 분야", desc: "눈, 코, 윤곽, 가슴 성형부터 지방이식, 피부 관리까지", image: doctor },
    { title: "안전한 시술", desc: "최신 레이저 및 검증된 의료 장비 도입", image: surgery, bgPos: "0% 30%" },
    { title: "사후 관리", desc: "만족도를 높이는 철저한 고객 관리 시스템", image: aftercare, bgPos: "0% 100%" },
  ];

  const handleMouseEnter = (idx) => {
    setHoverIndex(idx);
    setLastHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <section className="h-[800px] flex items-center justify-center relative">
      <div className="w-1/2 h-full font-[SeoulHangangM]">
        <h2 className="text-3xl font-bold m-12">연세 BT 미래병원 소개</h2>
        <div className="mt-12 text-xl">
          {introItems.map((item, idx) => (
            <div
              key={idx}
              className="ml-4 px-8 py-5 transition-all hover:ml-6 cursor-pointer"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-2xl font-bold">{item.title}</p>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 h-full overflow-hidden relative">
        {introItems.map((item, idx) => {
          const isVisible = lastHoverIndex === idx;
          const isActive = hoverIndex === idx;

          return (
            <div
              key={idx}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: item.bgPos || "center",
                backgroundRepeat: "no-repeat",
                height: "100%",
                width: "100%",
                position: "absolute",
                transition: "opacity 0.5s ease-in-out",
                opacity: isActive || isVisible ? 1 : 0,
                zIndex: isActive ? 20 : isVisible ? 10 : 0,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default IntroSection;
