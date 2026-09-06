import BannerSection from '@/components/common/BannerSection';
import DirectionsMap from '@/components/features/directions/DirectionsMap';
import TabSection from '@/components/features/treatment/TabSection';
import TreatmentContent from '@/components/features/treatment/TreatmentContent';
import { chin_hor } from '@/assets/cdnImages';
import Spacer from '@/components/common/Spacer';
import ScrollToTopOnTabChange from '@/components/common/ScrollToTopOnTabChange';
import ProcedureDetail from '@/components/features/treatment/ProcedureDetail';

const tabList = [
  { key: '1', label: '광대축소 수술' },
  { key: '2', label: '사각턱 수술' },
  { key: '3', label: 'V라인 턱끝 성형수술' },
  { key: '4', label: '양악수술' },
  { key: '5', label: '이중턱 지방흡입' },
];

const renderFaceContent = (tab) => {
  switch (tab) {
    case '1': return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">광대축소 수술</h2>
        <p className="text-lg mt-10">
          돌출된 광대를 안쪽으로 줄여 얼굴의 너비를 축소합니다.<br/>
          입체감을 살리면서도 부드러운 인상을 연출할 수 있습니다.<br/>
          측면, 45도, 정면에서 모두 조화로운 윤곽을 구현합니다.
        </p>
      </ProcedureDetail>
    );
    case '2': return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">사각턱 수술</h2>
        <p className="text-lg mt-10">
          각진 턱 라인을 부드럽게 정리하여 갸름한 얼굴형을 만들어줍니다.<br/>
          하악각 절제와 근육 조절을 통해 자연스럽게 개선합니다.<br/>
          강해 보이던 인상을 부드럽고 여성스럽게 바꿔줍니다.
        </p>
      </ProcedureDetail>
    );
    case '3': return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">V라인 턱끝 성형수술</h2>
        <p className="text-lg mt-10">
          무턱 또는 뭉툭한 턱끝을 세련된 V라인으로 교정하는 시술입니다.<br/>
          턱끝의 길이와 폭을 조정해 전체적인 얼굴 밸런스를 맞춥니다.<br/>
          입체감 있고 매끄러운 윤곽을 완성할 수 있습니다.
        </p>
      </ProcedureDetail>
    );
    case '4': return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">양악수술</h2>
        <p className="text-lg mt-10">
          위턱과 아래턱의 위치를 바로잡아 전체적인 안모를 교정합니다.<br/>
          심미적 개선은 물론 기능적 개선도 동시에 이룰 수 있습니다.<br/>
          골격 불균형, 부정교합 등 복합적인 문제에 적합합니다.
        </p>
      </ProcedureDetail>
    );
    case '5': return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">이중턱 지방흡입</h2>
        <p className="text-lg mt-10">
          턱 밑에 쌓인 불필요한 지방을 제거해 갸름한 턱선을 만들어줍니다.<br/>
          짧은 시술 시간과 빠른 회복으로 인기가 높습니다.<br/>
          턱선이 모호한 인상을 개선해 또렷한 얼굴형을 완성합니다.
        </p>
      </ProcedureDetail>
    );
    default: return (
      <ProcedureDetail part="face">
        <h2 className="text-4xl font-bold">윤곽 성형</h2>
        <p className="text-lg mt-10">
          윤곽 성형의 다양한 옵션을 확인해보세요.
        </p>
      </ProcedureDetail>
    );
  }
};

const FacePage = () => (
  <>
    <BannerSection image={chin_hor} title="윤곽 성형" subtitle="자연스럽게 깎아낸 아름다움" objectPosition="object-[50%_30%]" />
    <div className="relative z-20 bg-white">
      <ScrollToTopOnTabChange />
      <TabSection tabList={tabList} />
      <TreatmentContent renderContent={renderFaceContent} />
      <Spacer size="lg" />
      <DirectionsMap />
      <Spacer size="lg" />
    </div>
  </>
);

export default FacePage;
