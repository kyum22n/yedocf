import { useState } from "react";
import { eye1, eye2, eye3, eye5, eye6, eye7, eye8, eye9, nose1, nose2, nose3, nose4, nose5, face1, face3, face4, face5, face6 } from '@/assets/cdnImages';
import { Link } from "react-router-dom";

const ProcedureSection = () => {
    const [mainTab, setMainTab] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [lastHoverIndex, setLastHoverIndex] = useState(0);

const procedureItems = [
  {
    title: "코",
    children: [
      { title: "콧대 성형", desc: "낮은 콧대를 높여 또렷한 인상 연출", image: nose2, bgPos: "50% 0%", navi: "/nose?tab=1" },
      { title: "매부리코 성형", desc: "튀어나온 콧등을 매끄럽게 교정", image: nose4, bgPos: "90%", navi: "/nose?tab=2" },
      { title: "복코 교정", desc: "둥글고 뭉툭한 코끝을 세련되게 개선", image: nose3, bgPos: "100%", navi: "/nose?tab=3" },
      { title: "코끝 성형", desc: "처진 코끝을 날렵하게 다듬는 수술", image: nose1, bgPos: "50%", navi: "/nose?tab=4" },
      { title: "콧볼 축소", desc: "넓은 콧볼을 자연스럽게 줄이는 수술", image: nose5, bgPos: "50%", navi: "/nose?tab=5" },
    ],
  },
  {
    title: "눈",
    children: [
      { title: "쌍커풀 수술", desc: "또렷한 눈매를 위한 클래식한 선택", image: eye1,  navi: "/eye?tab=1" },
      { title: "비절개 쌍커풀 수술", desc: "붓기 적고 빠른 회복이 가능한 쌍커풀", image: eye2, bgPos: "0%", navi: "/eye?tab=2" },
      { title: "앞트임 수술", desc: "답답한 눈매를 시원하게 개선", image: eye3, bgPos: "30%", navi: "/eye?tab=3" },
      { title: "뒤트임 수술", desc: "눈의 가로 길이를 확장해 더 크고 시원한 눈매", image: eye5, bgPos: "0%", navi: "/eye?tab=4" },
      { title: "밑트임 수술", desc: "세로 길이를 보완해 부드러운 인상 연출", image: eye6, bgPos: "15%", navi: "/eye?tab=5" },
      { title: "눈매교정 수술", desc: "처진 눈꺼풀을 올려 또렷한 인상으로", image: eye7, bgPos: "55%", navi: "/eye?tab=6" },
      { title: "지방 재배치", desc: "꺼진 눈 밑에 볼륨을 더해 자연스러운 눈가", image: eye8, bgPos: "70%", navi: "/eye?tab=7" },
      { title: "다크서클 제거", desc: "눈 밑 그늘을 밝히는 개선 수술", image: eye9, bgPos: "100%", navi: "/eye?tab=8" },
    ],
  },
  {
    title: "윤곽",
    children: [
      { title: "광대 축소술", desc: "튀어나온 광대를 안으로 넣어 부드러운 인상", image: face1, bgPos: "55%", navi: "/face?tab=1" },
      { title: "사각턱 수술", desc: "각진 턱 라인을 매끈하게 정리", image: face3, bgPos: "35%", navi: "/face?tab=2" },
      { title: "V라인 턱끝 성형", desc: "갸름하고 세련된 턱끝 완성", image: face4, bgPos: "10%", navi: "/face?tab=3" },
      { title: "양악 수술", desc: "부정교합 및 얼굴 비대칭 개선", image: face5, bgPos: "50%", navi: "/face?tab=4" },
      { title: "이중턱 지방흡입", desc: "늘어진 턱살을 제거해 탄력 있는 턱선", image: face6, bgPos: "100%", navi: "/face?tab=5" },
    ],
  },
];

    const currentItems = procedureItems[mainTab].children;

    return (
        <section className="h-[800px] flex items-center justify-center relative overflow-hidden">
            {/* 왼쪽: 탭 및 리스트 */}
            <div className="w-1/2 h-full font-[SeoulHangangM]">
                <h2 className="text-4xl font-bold m-12">연세 BT 미래병원 시술 안내</h2>

                {/* 1단계 탭 (코/눈/윤곽) */}
                <div className="flex ml-4 space-x-4 mt-4">
                    {procedureItems.map((group, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-2 border-b-2 transition-all font-bold ${mainTab === idx ? "border-black text-black" : "border-transparent text-gray-400"
                                }`}
                            onClick={() => {
                                setMainTab(idx);
                                setHoverIndex(null);
                                setLastHoverIndex(0);
                            }}
                            onMouseEnter={() => {
                                setMainTab(idx);
                                setHoverIndex(null);
                                setLastHoverIndex(0);
                            }}
                        >
                            {group.title}
                        </button>
                    ))}
                </div>

                {/* 2단계 리스트 (해당 탭의 세부 시술 목록) */}
                <div className="mt-6 text-xl">
                    {currentItems.map((item, idx) => (
                        <Link
                            to={item.navi}
                            key={idx}
                            className="ml-4 px-8 py-3 transition-all hover:ml-6 cursor-pointer flex gap-4"
                            onMouseEnter={() => {
                                setHoverIndex(idx);
                                setLastHoverIndex(idx);
                            }}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <span className="text-gray-400">{idx + 1}.</span>
                            <div>
                                <p className="text-2xl font-bold">{item.title}</p>
                                <p>{item.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 오른쪽: 이미지 출력 */}
            <div className="w-1/2 h-full overflow-hidden relative">
                {currentItems.map((item, idx) => {
                    const isVisible = lastHoverIndex === idx;
                    const isActive = hoverIndex === idx;

                    return (
                        <div
                            key={idx}
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: item.bgPos || "center center",
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

export default ProcedureSection;
