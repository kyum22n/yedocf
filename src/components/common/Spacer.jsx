const Spacer = ({
  size = "md",
  responsive = {}, // 예: { sm: 'sm', md: 'lg', lg: 'xl' }
}) => {
  const baseClass = `h-${getSizeValue(size)}`;

  const responsiveClasses = Object.entries(responsive)
    .map(([breakpoint, sizeKey]) => `${breakpoint}:h-${getSizeValue(sizeKey)}`)
    .join(" ");

  return <div className={`${baseClass} ${responsiveClasses}`} />;
};

// 사이즈 키를 Tailwind 숫자로 매핑 (추후 리팩토링 가능)
function getSizeValue(key) {
  const map = {
    none: 0,      // 0px
    "0": 0,       // 0px
    xs: 2,        // 0.5rem = 8px
    sm: 4,        // 1rem = 16px
    md: 8,        // 2rem = 32px
    lg: 16,       // 4rem = 64px
    xl: 24,       // 6rem = 96px
    "2xl": 32,    // 8rem = 128px
    "3xl": 40,    // 10rem = 160px
  };
  return map[key] || 8;
}

export default Spacer;
// 반응형 디자인을 고려하여 다양한 크기의 여백을 제공하는 Spacer 컴포넌트입니다.
// size prop을 통해 여백의 크기를 조절할 수 있으며, 기본값은 'md'입니다.
// sm, md, lg, xl 크기를 지원하며, 각 크기는 Tailwind CSS의 유틸리티 클래스를 사용하여 정의됩니다.
// 이 컴포넌트는 페이지 레이아웃에서 요소 간의 간격을 조절하는 데 유용합니다.
// 사용 예시:
// <Spacer size="lg" />