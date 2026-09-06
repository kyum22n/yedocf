import Container from '@/components/layout/Container';
import { useSearchParams } from 'react-router-dom';

const TreatmentContent = ({ renderContent, defaultTab = '1' }) => {
  const [params] = useSearchParams();
  const tab = params.get('tab') || defaultTab;

  return (
    <Container>
      {renderContent(tab)}
    </Container>
  );
};
export default TreatmentContent;
// 이 컴포넌트는 시술 페이지의 콘텐츠 영역을 렌더링합니다.
// useSearchParams 훅을 사용하여 URL의 'tab' 파라미터를 가져오고,
// 해당 탭에 맞는 콘텐츠를 renderContent 함수로 렌더링합니다.
// 기본 탭은 '1'로 설정되어 있으며, 이 값을 통해 현재 선택된 탭에 맞는 콘텐츠를 표시합니다.
// 이 컴포넌트는 시술 페이지의 콘텐츠 영역에 위치하여,
// 사용자가 선택한 탭에 따라 동적으로 콘텐츠를 변경할 수 있도록 도와줍니다.
// renderContent 함수는 현재 탭에 맞는 콘텐츠를 반환하는 함수로,
// 각 탭에 대한 콘텐츠를 정의하는 데 사용됩니다.
// 이 컴포넌트는 시술 페이지의 콘텐츠 영역을 구성하며,
// 사용자가 선택한 탭에 따라 동적으로 콘텐츠를 표시합니다.
