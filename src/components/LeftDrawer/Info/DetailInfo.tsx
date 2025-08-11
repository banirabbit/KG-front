import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import React, { useEffect, useState } from "react";

export default function DetailInfo() {
  const selectedInfo: { [key: string]: any } = useSelector(
    (state: AppState) => state.GraphData.selectedInfo
  );
  const selectedNodes = useSelector(
    (state: AppState) => state.GraphData.selectedNodes
  );
  const filterWords = [
    "style",
    "labelCfg",
    "img",
    "degree",
    "inDegree",
    "isReal",
    "oriLabel",
    "labelLineNum",
    "oriFontSize",
    "type",
    "x",
    "y",
    "size",
    "outDegree",
    "id",
    "startPoint",
    "endPoint",
  ];
  // 将对象的每一项映射为一个包含索引和值的对象数组
  const filteredItems = Object.entries(selectedInfo)
    .filter(
      ([key]) => filterWords.find((element) => element === key) === undefined
    )
    .map(([key, value]) => ({
      key: key === "group" ? "node type" : key,
      value: value,
    }));
  const [showDiv, setShowDiv] = useState("detailInfoContainer");
  const [showUl, setShowUl] = useState("");
  const handleDivMouseEnter = () => {
    setShowDiv("detailInfoContainer customScrollbar");
  };
  const handleDivMouseLeave = () => {
    setShowDiv("detailInfoContainer");
  };
  const handleULMouseEnter = () => {
    setShowUl("customScrollbar");
  };
  const handleULMouseLeave = () => {
    setShowUl("");
  };
  return (
    <div
      className={showDiv}
      onMouseEnter={handleDivMouseEnter}
      onMouseLeave={handleDivMouseLeave}
    >
      <h2>{selectedInfo.name}</h2>
      <div className="detail">
        <div style={{ fontSize: "14px", fontWeight: "700", margin: "5px" }}>
          详情信息
        </div>
        <ul
          className={showUl}
          onMouseEnter={handleULMouseEnter}
          onMouseLeave={handleULMouseLeave}
        >
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
              <li style={{ fontWeight: 600 }}>{item.key}</li>
              <li style={{ color: "#ffffffa8" }}>
                {typeof item.value === "object"
                  ? JSON.stringify(item.value)
                  : String(item.value)}
              </li>
              <div className="divider" style={{ marginBottom: 0 }}></div>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
