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
    "label",
    "oriLabel",
    "labelLineNum",
    "oriFontSize",
    "type",
    "x",
    "y",
    "size",
    "outDegree",
    "id",
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
      <span style={{ margin: "5px", fontSize: "14px" }}>Selected Node</span>
      <div className="detail">
        <div style={{ fontSize: "14px", fontWeight: "700", margin: "5px" }}>
          NODE DATA
        </div>
        <ul
          className={showUl}
          onMouseEnter={handleULMouseEnter}
          onMouseLeave={handleULMouseLeave}
        >
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
              <li style={{fontWeight:600}}>{item.key}</li>
              <li style={{color:"#ffffffa8"}}>{item.value}</li>
              <div className="divider" style={{ marginBottom: 0 }}></div>
            </React.Fragment>
          ))}
        </ul>
      </div>
      {/* <div className="detail" style={{ textAlign: "center" }}>
        <h4>FOUND {selectedNodes} RECORD</h4>
        <button style={{ backgroundColor: "#D1A9B5" }}>OPEN TABLE</button>
        <h4>EXPORT DATA</h4>
        <button style={{ backgroundColor: "#9BAFB8" }}>EXPORT</button>
      </div> */}
    </div>
  );
}
