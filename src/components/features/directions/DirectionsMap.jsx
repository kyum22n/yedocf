import Map from './Map';

const DirectionsMap = () => {
  return (
    <section
      id="directions"
      className="py-16 bg-white pt-40"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        <div className="flex-1 min-w-0 font-body">
          <h2 className="text-2xl font-extrabold mb-4">오시는 길</h2>
          <address className="not-italic mb-4">
            연세시 연세구 연세로 123 (연세동) 연세빌딩 99층
          </address>

          <h3 className="font-bold">진료 안내</h3>
          <ul className="mb-4">
            <li>월–금: 10:00 ~ 18:00</li>
            <li>토요일: 10:00 ~ 13:00</li>
            <li>일요일/공휴일: 휴무</li>
          </ul>

          <p className="mb-1 font-bold">TEL</p>
          <p className="mb-4">010-123-1231</p>

          <p className="text-sm text-gray-500">
            <strong>지하철</strong>: 100호선 연세역 12번 출구 도보 3분<br />
            <strong>버스</strong>: 9999, 8888, 7777, 6666 외<br />
            <strong>차량</strong>: 건물 내 주차 가능
          </p>
        </div>

        <div className="flex-1 max-w-[600px]">
          <Map />
        </div>
      </div>
    </section>
  );
};

export default DirectionsMap;