const BannerSection = ({ image, title, subtitle, objectPosition = 'object-center' }) => (
  //섹션 높이 300px, 너비 100%
  <div className="sticky top-0 w-full h-[400px] z-0">
  {/* 배경 이미지 설정, 대체 텍스트, 섹션을 채우고 추가로 이미지 위치를 조정 가능 */}
    <img
      src={image}
      alt={title}
      className={`w-full h-full object-cover ${objectPosition}`}
    />
    {/* 폰트 가독성을 위해 배경 이미지 위에 어두운 반투명 레이어 추가 */}
    <div className="bg-black/20 w-full h-full absolute top-0 z-10"></div>
    {/* 배너 텍스트를 중앙 하단쯤에 배치하고 그림자 효과 추가 */}
    <div className=" absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 user-font">
      <h2 className="text-4xl font-bold text-shadow-lg">{title}</h2>
      <p className="mt-2 text-lg text-shadow-lg">{subtitle}</p>
    </div>
  </div>
);

export default BannerSection;
// 시술/수술 설명 페이지의 상단 배너 컴포넌트입니다.