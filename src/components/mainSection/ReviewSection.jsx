import {
    portrait1, portrait2, portrait3, portrait4, portrait5, portrait6, portrait7,
    portrait8, portrait9, portrait10, portrait11, portrait12, portrait13
} from '@/assets/cdnImages';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const reviewsTop = [
    { image: portrait1, tags: ['#자연스러운라인', '#쌍꺼풀대만족', '#회복빠름'], comment: '붓기도 거의 없고 자연스러워서 친구들이 제가 언제 수술한 지도 몰라요!' },
    { image: portrait2, tags: ['#코성형', '#콧대UP', '#셀카맛집'], comment: '저는 낮은 콧대가 콤플렉스였는데 이제는 자신감이 생겼어요!' },
    { image: portrait3, tags: ['#눈매교정', '#인상개선', '#만족도최상'], comment: '졸려보인다는 말 안 듣는 것만으로도 인생이 완전히 바뀐 느낌!' },
    { image: portrait4, tags: ['#복코교정', '#코끝교정', '#얼굴작아짐'], comment: '코 모양이 정리되니까 전체적인 윤곽도 달라보여요!' },
    { image: portrait5, tags: ['#윤곽3종', '#광대축소', '#턱끝성형'], comment: 'V라인 제대로 잡혔어요. 진짜 시술 잘하는 곳!' },
    { image: portrait6, tags: ['#다크서클제거', '#눈밑지방', '#피부톤업'], comment: '항상 피곤해 보인다는 말 들었는데 요즘은 생기있어졌단 얘기 들어요.' },
];


const reviewsBottom = [
    { image: portrait7, tags: ['#비절개쌍꺼풀', '#자연유지', '#티안남'], comment: '회사 복귀했는데 아무도 모를 정도로 자연스러워요!' },
    { image: portrait8, tags: ['#앞트임', '#눈매길어짐', '#시원한눈'], comment: '시원하고 선명한 눈매가 완성됐어요. 메이크업도 더 잘 어울리는거같아요!' },
    { image: portrait9, tags: ['#콧볼축소', '#전체비율UP', '#디테일'], comment: '작은 변화인데 얼굴 전체 밸런스가 달라졌어요!' },
    { image: portrait10, tags: ['#이중턱지방흡입', '#날렵한턱선', '#라인살림'], comment: '셀카 찍을 때 턱선이 확 살아나서 너무 만족해요!' },
    { image: portrait11, tags: ['#눈밑지방재배치', '#생기회복', '#동안효과'], comment: '푹 꺼진 눈 밑이 채워지니까 인상이 훨씬 밝고 부드러워졌어요.' },
    { image: portrait12, tags: ['#사각턱보톡스', '#턱라인개선', '#자연변화'], comment: '주변에서 살 빠졌냐고 깜짝 놀라서 물어봐요. 자연스럽게 예뻐진 기분!' },
    { image: portrait13, tags: ['#양악수술', '#교합개선', '#자신감업'], comment: '이제 사진 찍을 때 자신있게 찍을 수 있어요. 진작 수술받을걸 그랬어요!' },
];


const ReviewCard = ({ review }) => (
    <div className="w-[360px] h-[550px] rounded-xl overflow-hidden shadow-md relative">
        <div
            className="h-full w-full bg-cover"
            style={{
                backgroundImage: `url(${review.image})`,
                backgroundPosition: "center",
            }}
        />
        <div className=" text-white text-left p-3 text-xs h-[100px] w-[360px] flex flex-col  absolute bottom-0"
            style={{ background: "linear-gradient(0deg,rgba(0, 0, 0, 0.7) 6%, rgba(50, 50, 50, 0.46) 85%, rgba(0,0,0, 0.01) 100%)" }}
        >
            <p className="truncate font-bold text-lg">{review.tags.join(' ')}</p>
            <p className="mt-1 text-base">{review.comment}</p>
        </div>
    </div>
);

const ReviewSlider = ({ reviews, reverse = false }) => (
    <Swiper
        modules={[Autoplay]}
        spaceBetween={2}
        slidesPerView={3}
        loop={true}
        autoplay={{
            delay: 3000,
            reverseDirection: reverse,
        }}
        speed={1500}
        className="mb-10"
    >
        {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
                <ReviewCard review={review} />
            </SwiperSlide>
        ))}
    </Swiper>
);

const ReviewSection = () => {
    return (
        <section className="py-16 px-4 bg-white text-center">
            <h2 className="text-3xl font-bold mb-12">
                연세 BT 미래병원의 고객님들이 남기신 후기
            </h2>
            <div className="max-w-[1200px] mx-auto">
                <ReviewSlider reviews={reviewsTop} reverse={false} />
                <ReviewSlider reviews={reviewsBottom} reverse={true} />
            </div>
        </section>
    );
};

export default ReviewSection;
