const Container = ({ children, className = '' }) => (
  <div
    className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}
  >
    {children}
  </div>
);

export default Container;
// 안에 들어가는 children 요소들을 최대 너비 1200px로 중앙 정렬하고 좌우 여백을 추가하는 컨테이너 컴포넌트입니다.
// className 속성을 통해 추가적인 스타일을 적용할 수 있습니다.
// 안에 들어가는 요소들은 자동으로 중앙에 정렬되며, 반응형 디자인을 지원합니다.