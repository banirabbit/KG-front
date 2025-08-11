import React, { useState, FC } from "react";
import "./LeftDrawer.css";
import { createFromIconfontCN } from "@ant-design/icons";
import General from "./General/General";
import Info from "./Info/Info";
const SideArrow = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4425519_6zqord7489w.js",
});

export default function LeftDrawer() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedContent, setSelectedContent] = useState("Content 1");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const changeContent = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <div className="leftdrawerContainer">
      <div className={`drawer ${sidebarOpen ? "" : "closed"}`}>
        <div className="content-buttons">
          <button style={{ color: "#fff" }}>
            <svg className="mainicon" aria-hidden="true">
              <use xlinkHref="#icon-business-icon-sales-center"></use>
            </svg>
          </button>
          <button
            onClick={() => changeContent("Content 1")}
            className="iconfont"
          >
            常规
          </button>
          <button
            onClick={() => changeContent("Content 2")}
            className="iconfont"
          >
            详情信息
          </button>
        </div>
        {selectedContent === "Content 1" ? (
          <General></General>
        ) : selectedContent === "Content 2" ? (
          <Info></Info>
        ):(<></>)}
      </div>
      <button onClick={toggleSidebar} className="togglebutton">
        {sidebarOpen ? (
          <SideArrow type="icon-left" />
        ) : (
          <SideArrow type="icon-right"></SideArrow>
        )}
      </button>
    </div>
  );
}
