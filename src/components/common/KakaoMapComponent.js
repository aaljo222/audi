import React, { useEffect } from "react";

const KakaoMapComponent = ({ place }) => {
  useEffect(() => {
    const mapContainer = document.getElementById("kakao-map");

    // 카카오맵 API가 로드되었는지 확인
    const checkKakaoMapAPI = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      } else {
        // API가 로드되지 않은 경우 500ms 후 다시 확인
        setTimeout(checkKakaoMapAPI, 500);
      }
    };

    // 지도 초기화 함수
    const initializeMap = () => {
      // 기본 지도 옵션 (서울시청 좌표)
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 장소명이 제공된 경우 검색
      if (place) {
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(place, (data, status) => {
          if (
            status === window.kakao.maps.services.Status.OK &&
            data.length > 0
          ) {
            const firstPlace = data[0];
            const coords = new window.kakao.maps.LatLng(
              firstPlace.y,
              firstPlace.x
            );

            // 지도 중심 이동
            map.setCenter(coords);

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${place}</div>`,
            });

            // 인포윈도우 표시
            infowindow.open(map, marker);
          }
        });
      }
    };

    // 초기 확인 시작
    checkKakaoMapAPI();
  }, [place]);

  return <div id="kakao-map" style={{ width: "100%", height: "400px" }}></div>;
};

export default KakaoMapComponent;
