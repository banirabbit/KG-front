import React, { useState, FC } from "react";
import "./LeftDrawer.css";
import { createFromIconfontCN } from "@ant-design/icons";
import General from "./General";
const SideArrow = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4425519_u66w2iw5mp.js",
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
          <button style={{backgroundColor:"#FC8F9B",}}>import</button>
          <button onClick={() => changeContent("Content 1")} style={{backgroundColor:"#4B81BF",}}>general</button>
          <button onClick={() => changeContent("Content 2")} style={{backgroundColor:"#FF6900",}}>info</button>
          <button onClick={() => changeContent("Content 3")} style={{backgroundColor:"#00C756",}}>layout</button>
        </div>
        {selectedContent === "Content 1" ? (
          <General></General>
        ) : (
          <div>content any</div>
        )}
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
