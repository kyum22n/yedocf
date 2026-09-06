import BannerSection from '@/components/common/BannerSection';
import DirectionsMap from '@/components/features/directions/DirectionsMap';
import TabSection from '@/components/features/treatment/TabSection';
import TreatmentContent from '@/components/features/treatment/TreatmentContent';
import { eye_hor } from '@/assets/cdnImages';
import Spacer from '@/components/common/Spacer';
import ScrollToTopOnTabChange from '@/components/common/ScrollToTopOnTabChange';
import ProcedureDetail from '@/components/features/treatment/ProcedureDetail';

const tabList = [
  { key: '1', label: '쌍커풀' },
  { key: '2', label: '비절개 쌍커풀' },
  { key: '3', label: '앞트임' },
  { key: '4', label: '뒤트임' },
  { key: '5', label: '밑트임' },
  { key: '6', label: '눈매 교정' },
  { key: '7', label: '지방 재배치' },
  { key: '8', label: '다크서클 제거' },
];

const renderEyeContent = (tab) => {
  switch (tab) {
    case '1': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">쌍꺼풀 수술</h2>
        <p className="text-lg text-white mt-10">
          또렷하고 선명한 눈매를 만들어주는 가장 기본적인 눈 성형입니다.<br />
          개인의 눈매에 따라 절개/비절개 방식으로 시술합니다.<br/>
          자연스러운 라인을 디자인하여 이미지에 맞는 변화를 줍니다.
        </p>
      </ProcedureDetail>
    );
    case '2': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">비절개 쌍꺼풀 수술</h2>
        <p className="text-lg text-white mt-10">
          절개 없이 실로 고정하여 쌍꺼풀 라인을 만드는 간편한 시술입니다.<br />
          회복 기간이 짧고 자연스러운 결과를 기대할 수 있습니다.<br/>
          눈꺼풀 처짐이 심하지 않은 경우에 적합합니다.
        </p>
      </ProcedureDetail>
    );
    case '3': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">앞트임 수술</h2>
        <p className="text-lg text-white mt-10">
          좁은 눈 사이 거리를 개선하여 눈매를 확장하는 시술입니다.<br />
          몽고주름을 자연스럽게 제거하여 시원한 인상을 줍니다.<br/>
          눈의 길이감과 비율을 개선해 또렷한 눈매를 완성합니다.
        </p>
      </ProcedureDetail>
    );
    case '4': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">뒤트임 수술</h2>
        <p className="text-lg text-white mt-10">
          답답한 눈꼬리를 부드럽게 늘려주는 시술입니다.<br />
          눈의 가로 길이를 연장하여 부드럽고 여성스러운 인상을 줍니다.<br/>
          흉터가 거의 남지 않고 자연스러운 효과를 기대할 수 있습니다.
        </p>
      </ProcedureDetail>
    );
    case '5': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">밑트임 수술</h2>
        <p className="text-lg text-white mt-10">
          세로 길이를 키워 눈동자가 더 커 보이도록 만드는 시술입니다.<br />
          눈 밑 피부를 살짝 내려 또렷하고 순한 인상을 연출합니다.<br/>
          다른 트임 수술과 병행할 경우 시너지 효과가 큽니다.
        </p>
      </ProcedureDetail>
    );
    case '6': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">눈매 교정 수술</h2>
        <p className="text-lg text-white mt-10">
          눈꺼풀 근육을 강화해 처진 눈을 또렷하게 개선합니다.<br />
          졸려 보이는 인상이나 무쌍 눈매에 효과적인 시술입니다.<br/>
          쌍꺼풀 수술과 병행하면 더욱 자연스러운 결과를 얻을 수 있습니다.
        </p>
      </ProcedureDetail>
    );
    case '7': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">지방 재배치 수술</h2>
        <p className="text-lg text-white mt-10">
          눈 밑 꺼짐과 불룩함을 동시에 개선하는 시술입니다.<br />
          눈 밑 지방을 재배치해 매끈하고 생기 있는 눈가를 만듭니다.<br/>
          다크서클 완화에도 탁월한 효과를 보입니다.
        </p>
      </ProcedureDetail>
    );
    case '8': return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">다크서클 제거</h2>
        <p className="text-lg text-white mt-10">
          눈 밑 색소침착과 음영을 줄여 또렷한 눈매를 만들어주는 시술입니다.<br />
          레이저 또는 필러를 활용해 맞춤형 치료가 가능합니다.<br/>
          피로해 보이던 인상을 밝고 생기 있게 바꿔줍니다.
        </p>
      </ProcedureDetail>
    );
    default: return (
      <ProcedureDetail part="eye">
        <h2 className="text-4xl font-bold text-white">눈 성형</h2>
        <p className="text-lg text-white mt-10">
          눈 성형의 다양한 옵션을 확인해보세요.
        </p>
      </ProcedureDetail>
    );
  }
};

const EyePage = () => (
  <>
    <BannerSection image={eye_hor} title="눈 성형" subtitle="맑고 또렷한 눈" />
    <div className="relative z-20 bg-white">
      <ScrollToTopOnTabChange />
      <TabSection tabList={tabList} />
      <TreatmentContent renderContent={renderEyeContent} />
      <Spacer size="lg" />
      <DirectionsMap />
      <Spacer size="lg" />
    </div>
  </>
);

export default EyePage;
