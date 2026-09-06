import BannerSection from '@/components/common/BannerSection';
import DirectionsMap from '@/components/features/directions/DirectionsMap';
import TabSection from '@/components/features/treatment/TabSection';
import TreatmentContent from '@/components/features/treatment/TreatmentContent';
import { nose_hor } from '@/assets/cdnImages';
import Spacer from '@/components/common/Spacer';
import ScrollToTopOnTabChange from '@/components/common/ScrollToTopOnTabChange';
import ProcedureDetail from '@/components/features/treatment/ProcedureDetail';

const tabList = [
  { key: '1', label: '콧대 성형' },
  { key: '2', label: '매부리코 성형' },
  { key: '3', label: '복코 교정' },
  { key: '4', label: '코끝 성형' },
  { key: '5', label: '콧볼 축소' },
];

const renderNoseContent = (tab) => {
  switch (tab) {
    case '1': return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">콧대 성형</h2>
        <p className="text-lg text-white mt-10">
          낮은 콧대를 높여 또렷하고 세련된 인상을 만들어주는 시술입니다.<br/>
          개인의 얼굴형에 맞는 보형물 또는 자가 연골을 사용합니다.<br/>
          자연스러운 라인을 구현하여 조화로운 옆모습을 완성합니다.
        </p>
      </ProcedureDetail>
    );
    case '2': return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">매부리코 성형</h2>
        <p className="text-lg text-white mt-10">
          튀어나온 콧등을 매끄럽게 다듬어 부드러운 인상을 줍니다.<br/>
          뼈와 연골의 불균형을 교정하여 곡선을 개선합니다.<br/>
          강한 인상을 부드럽고 세련되게 바꿔주는 데 효과적입니다.
        </p>
      </ProcedureDetail>
    );
    case '3': return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">복코 교정</h2>
        <p className="text-lg text-white mt-10">
          퍼진 코끝이나 두툼한 코 모양을 슬림하게 정리하는 시술입니다.<br/>
          피부 아래 연조직과 연골을 조정하여 세련된 인상을 줍니다.<br/>
          복코로 인해 답답해 보이는 이미지를 개선할 수 있습니다.
        </p>
      </ProcedureDetail>
    );
    case '4': return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">코끝 성형</h2>
        <p className="text-lg text-white mt-10">
          낮거나 뭉툭한 코끝을 오똑하게 다듬어주는 정밀 시술입니다.<br/>
          자가 연골을 활용하여 자연스럽고 탄력 있는 라인을 구현합니다.<br/>
          코끝의 각도와 길이를 조절하여 세련된 인상을 완성합니다.
        </p>
      </ProcedureDetail>
    );
    case '5': return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">콧볼 축소</h2>
        <p className="text-lg text-white mt-10">
          넓은 콧볼로 인해 커 보이는 코를 슬림하게 줄여주는 시술입니다.<br/>
          콧망울의 피부와 연조직을 조정하여 자연스럽게 축소합니다.<br/>
          입체적이고 균형 잡힌 얼굴형으로 변화를 줍니다.
        </p>
      </ProcedureDetail>
    );
    default: return (
      <ProcedureDetail part="nose">
        <h2 className="text-4xl font-bold text-white">코 성형</h2>
        <p className="text-lg text-white mt-10">
          코 성형의 다양한 옵션을 확인해보세요.
        </p>
      </ProcedureDetail>
    );
  }
};

const NosePage = () => (
  <>
    <BannerSection image={nose_hor} title="코 성형" subtitle="오뚝하게 세우는 자신감" />
    <div className="relative z-20 bg-white">
      <ScrollToTopOnTabChange />
      <TabSection tabList={tabList} />
      <TreatmentContent renderContent={renderNoseContent} />
      <Spacer size="lg" />
      <DirectionsMap />
      <Spacer size="lg" />
    </div>
  </>
);

export default NosePage;
