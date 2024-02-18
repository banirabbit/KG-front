import {
  Map,
  Marker,
  MapvglView,
  MapvglLayer,
  MapApiLoaderHOC,
} from "react-bmapgl";
import React, { useEffect } from "react";
import { data } from "../../data";
import { useSelector } from "react-redux";
function MapContainer() {
  /* global BMapGL */

  /* global mapv */

  /* global mapvgl */

  /* global initMap */

  /* global whiteStyle */
  const citys = [
    "北京",
    "天津",
    "上海",
    "重庆",
    "石家庄",
    "太原",
    "呼和浩特",
    "哈尔滨",
    "长春",
    "沈阳",
    "济南",
    "南京",
    "合肥",
    "杭州",
    "南昌",
    "福州",
    "郑州",
    "武汉",
    "长沙",
    "广州",
    "南宁",
    "西安",
    "银川",
    "兰州",
    "西宁",
    "乌鲁木齐",
    "成都",
    "贵阳",
    "昆明",
    "拉萨",
    "海口",
  ];
  const data = useSelector((state) => state.GraphData.citys);
  return (
    <Map
      style={{ position: "absolute", width: "100%", height: "100vh" }}
      center={{ lng: 116.402544, lat: 39.928216 }}
      zoom={6}
      enableScrollWheelZoom={true}
    >
      <MapvglView effects={["bright"]}>
        <MapvglLayer
          type="PointLayer"
          data={data}
          options={{
            blend: "lighter",
            size: 12,
            color: "rgb(255, 53, 0, 0.6)",
          }}
        />
      </MapvglView>
      :<></>
    </Map>
  );
}

export default MapApiLoaderHOC({ ak: "KmIjcNyAGYOO9Dqm9lZY35WMA51m26dP" })(
  MapContainer
);
