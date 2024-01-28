/**
 * 使用React自定义节点样式
 */
import React from "react";
import G6 from "@antv/g6";
import { Rect, Group, Circle, Image, Text } from "@antv/g6-react-node";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import Peoplesvg from "../../icons/user.svg";
import Companysvg from "../../icons/company.svg";
import Atom from "../../icons/atom.svg";
import Docusvg from "../../icons/document.svg";
import Accpetsvg from "../../icons/accept.svg";
const CNode = ({ svg }) => {
  return (
    <Group draggable>
      <Circle
        style={{
          r: 30,
          fill: "#fff",
          radius: [6, 6, 0, 0],
          stroke: "#9F9F9F",
          lineWidth: 2,
        }}
        draggable
      >
        <Image
          style={{
            img: svg,
            margin: 5,
          }}
          draggable
        ></Image>
      </Circle>
    </Group>
  );
};
export const People = ({ cfg }) => {
  const svg =
    cfg.group === "人"
      ? Peoplesvg
      : cfg.group === "企业"
      ? Companysvg
      : cfg.group === "许可证"
      ? Accpetsvg
      : cfg.group === "证书"
      ? Docusvg
      : Atom;
  const text = cfg.label.length > 5 ? cfg.label.substring(0, 5) + "..." : cfg.label
  return (
    <Group draggable>
      <Rect
        style={{
          display: "flex",
          maxWidth: 60,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        draggable
      >
        <CNode svg={svg}></CNode>
        <Rect
          style={{
            padding: 10,
          }}
          draggable
        >
          <Text
            style={{
              textBaseline: "bottom",
              fontSize: 14,
              fill: "#616161",
              textAlign: "left",
            }}
            draggable
          >
            {text}
          </Text>
        </Rect>
      </Rect>
    </Group>
  );
};
