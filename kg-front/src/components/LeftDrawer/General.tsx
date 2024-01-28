import { createFromIconfontCN } from "@ant-design/icons";
import styled from "@emotion/styled";
import "./LeftDrawer.css";
import LayoutDialog from "../LayoutDialog/LayoutDialog";
import { useState } from "react";
export default function General() {
  const SideArrow = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4425519_1imd83y5y7u.js",
  });
  const [layoutOpen, setLayoutOpen] = useState(false);
  return (
    <div className="content">
      <ul>
        <li>
          <button onClick={()=> setLayoutOpen(true)}>
            <div >布局配置</div>           
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>       
        <li>
          <button>
          <div>节点样式</div>
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>
        <div>
            <div className="nodestyle"></div>
        </div>
        <li>
          <button>
          <div>边样式</div>
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>
        <li>
          <button>
          <div>操作</div>
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>
      </ul>
      <LayoutDialog open={layoutOpen} setOpen={setLayoutOpen}></LayoutDialog>
    </div>
  );
}
