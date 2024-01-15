import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { data } from "./data";
import G6, { Graph } from "@antv/g6";
import ControlledOpenSpeedDial from "./components/ControlledOpenSpeedDial";
import { Container, Grid } from "@mui/material";
import RightCard from "./components/RightDrawer";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./store";
import { graph } from "neo4j-driver";
function App() {
  // const neo4j = require("neo4j-driver");
  // const uri = "bolt://localhost:7687"; // Neo4j 服务器的 URI
  // const user = "neo4j";
  // const password = "12345678";
  // const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  // const session = driver.session();
  // const [data, setData] = useState({});
  // 创建 G6 图实例
  const myRef = useRef(null);
  const layoutInfo = useSelector((state: AppState) => state.Layout.layoutInfo);
  useEffect(() => {
    // // 调用查询函数
    // executeNeo4jQueryNode(driver, session)
    //   .then((data) => {
    //     console.log("Data from Neo4j:", data);
    //     setData(data);
    //   })
    //   .catch((error) => console.error("Error executing Neo4j query:", error))
    //   .finally(() => {
    //     // 确保在所有操作结束后关闭 driver
    //     driver.close();
    //   });
    const miniMap = new G6.Minimap();
    const container = myRef.current;
    if (container === null || container === undefined) {
      throw new Error(
        "Container not found. Make sure to set the containerRef."
      );
    }
    const graph = new G6.Graph({
      container,
      modes: {
        default: ["drag-canvas", "drag-node"],
        edit: ["click-select"],
      },
      defaultNode: {
        shape: "node",
        size: 70,
        // 节点文本样式
        labelCfg: {
          style: {
            fill: "#000000A6",
            fontSize: 10,
          },
        },
        // 节点默认样式
        style: {
          fill: "#c6ec70",
          stroke: null,
        },
      },
      defaultEdge: {
        shape: "polyline",
      },
      // 节点交互状态配置
      nodeStateStyles: {
        hover: {
          stroke: "red",
          lineWidth: 3,
        },
      },
      edgeStateStyles: {
        hover: {
          stroke: "blue",
          lineWidth: 3,
        },
      },
      layout: {
        type: "random",
        // center: [500, 300], // 可选，默认为图的中心
        // linkDistance: 200, // 可选，边长
        // maxIteration: 1000, // 可选
        // focusNode: "node11", // 可选
        // unitRadius: 100, // 可选
        // preventOverlap: true, // 可选，必须配合 nodeSize
        // nodeSize: 30, // 可选
        // strictRadial: false, // 可选
        // workerEnabled: true, // 可选，开启 web-worker
      },
      animate: true,
      //plugins: [miniMap],
    });
    const edges = graph.getEdges();
    edges.forEach((edge: { getKeyShape: () => any; getTarget: () => any }) => {
      const line = edge.getKeyShape();
      const stroke = line.attr("stroke");
      const targetNode = edge.getTarget();
      targetNode.update({
        style: { stroke },
      });
    });
    graph.data(data);
    graph.render();
    console.log(layoutInfo);
    graph.updateLayout(layoutInfo);
    return () => {
      // 销毁G6图形实例
      graph.destroy();
    };
  }, [layoutInfo]);

  return (
    <Grid container className="kgBackground">
      <div ref={myRef} className="kgContainer"></div>
      <ControlledOpenSpeedDial></ControlledOpenSpeedDial>
      <RightCard></RightCard>
    </Grid>
  );
}

export default App;
