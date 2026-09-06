import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
const script = document.createElement("script");
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.500613, 127.036431), // 병원 위치 좌표
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          position: options.center,
        });
        marker.setMap(map);
      });
    };
    document.head.appendChild(script);
    console.log("카카오 키:", import.meta.env.VITE_KAKAO_API_KEY);

  }, []);

  return <div id="map" className="w-full h-[400px] rounded-lg shadow-md" />;
}
// 이 컴포넌트는 카카오 지도를 표시합니다.
// useEffect 훅을 사용하여 컴포넌트가 마운트될 때 카카오 지도 API를 로드하고, 병원 위치에 마커를 표시합니다.
// 지도는 고정된 크기(400px 높이)로 설정되어 있으며, 너비는 100%로 설정되어 있습니다.
