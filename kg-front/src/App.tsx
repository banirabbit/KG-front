import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { data } from "./data";
import G6, { Graph } from "@antv/g6";
import ControlledOpenSpeedDial from "./components/ControlledOpenSpeedDial";
import { Container, Grid } from "@mui/material";
import LeftDrawer from "./components/LeftDrawer/LeftDrawer";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./store";
import { Map, Marker, NavigationControl, InfoWindow } from "react-bmapgl";
import {
  executeNeo4jQueryNode,
  fetchData,
  getCitys,
  getLength,
  setRelationships,
  updateGraphData,
} from "./actions/dataAction";
import Loading from "./components/Loading/Loading";
import RegisterEdgeStyle from "./components/Style/RegisterStyle";
import {
  bindListener,
  processNodesEdges,
  clearFocusEdgeState,
  clearFocusItemState,
} from "./graphfunc";
import ReactDOM from "react-dom";
import MapContainer from "./components/MapContainer/MapContainer";
import RightTopStatistic from "./components/RightTopStatistic";

function App() {
  //neo4j服务器信息配置
  const neo4j = require("neo4j-driver");
  const uri = "bolt://localhost:7687"; // Neo4j 服务器的 URI
  const user = "neo4j";
  const password = "12345678";
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();
  const [dbdata, setDBData] = useState<any>({ name: "123" });
  // 创建 G6 图实例
  const myRef = useRef<HTMLDivElement>(null);
  let CANVAS_WIDTH: number;
  let CANVAS_HEIGHT: number;
  let shiftKeydown = false;
  const layout: any = {};
  const { layoutInfo } = useSelector((state: AppState) => state.Layout);
  const { appendData, searchNodes, isMapModel, relationships, selectedNodes } = useSelector(
    (state: AppState) => state.GraphData
  );
  const [loaddata, setLoadData] = useState(false);

  const dispatch = useDispatch();
  RegisterEdgeStyle();
  useEffect(() => {
    // 调用查询函数
    executeNeo4jQueryNode(driver, session, dispatch, relationships)
      .then((data) => {
        const { edges: processEdges, nodes: processNodes } = processNodesEdges(
          data.nodes,
          data.edges,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          false,
          true
        );

        setDBData({ nodes: processNodes, edges: processEdges });
        console.log(processEdges, processNodes);
        setLoadData(true);
      })
      .catch((error) => console.error("Error executing Neo4j query:", error))
      .finally(() => {
        // 确保在所有操作结束后关闭 driver
        driver.close();
      });
    //dispatch(getCitys());
  }, [relationships]);
  //展开节点
  useEffect(() => {
    if (appendData !== undefined && Object.keys(appendData).length > 0) {
      let temp = {
        nodes: [...dbdata.nodes, ...appendData.nodes],
        edges: [...dbdata.edges, ...appendData.edges],
      };
      const { edges: processEdges, nodes: processNodes } = processNodesEdges(
        temp.nodes,
        temp.edges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true
      );
      setDBData({ nodes: processNodes, edges: processEdges });
    }
  }, [appendData]);
  //获得当前节点数
  useEffect(() => {
    if (dbdata.nodes !== undefined && dbdata.edges !== undefined) {
      dispatch(getLength(dbdata.nodes.length));
    }
  }, [dbdata]);
  //搜索
  useEffect(() => {
    if (searchNodes !== undefined && Object.keys(searchNodes).length > 0) {
      let temp = {
        nodes: searchNodes,
        edges: [],
      };
      const { edges: processEdges, nodes: processNodes } = processNodesEdges(
        temp.nodes,
        temp.edges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true
      );
      setDBData({ nodes: processNodes, edges: processEdges });
    }
  }, [searchNodes]);
  useEffect(() => {
    if (loaddata) {
      const container = myRef.current;
      if (container === null || container === undefined) {
        throw new Error(
          "Container not found. Make sure to set the containerRef."
        );
      }
      if (!isMapModel) {
        const miniMap = new G6.Minimap();
        const grid = new G6.Grid();
        const toolbar = new G6.ToolBar();

        CANVAS_WIDTH = container.scrollWidth;
        CANVAS_HEIGHT = (container.scrollHeight || 500) - 30;
        const graph = new G6.Graph({
          container,
          linkCenter: true,
          minZoom: 0.1,
          modes: {
            default: [
              {
                type: "drag-canvas",
                enableOptimize: true,
              },
              {
                type: "zoom-canvas",
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
              "drag-node",
              "shortcuts-call",
            ],
            lassoSelect: [
              {
                type: "zoom-canvas",
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
              {
                type: "lasso-select",
                selectedState: "focus",
                trigger: "drag",
              },
            ],
            fisheyeMode: [],
          },
          animate: true,
          plugins: [toolbar],
        });
        console.log("render");
        graph.data(dbdata);
        graph.render();
        if (dbdata.nodes.length === 1) {
          graph.focusItem(graph.getNodes()[0], true, {
            easing: "easeCubic",
            duration: 400,
          });
        }
        const layoutConfig: any = {
          type: "gForce",
          minMovement: 0.01,
          maxIteration: 5000,
          preventOverlap: true,
          damping: 0.99,
          edgeStrength: 30,
          nodeStrength: 700,
          linkdistance: 300,
          tick: () => {
            graph.refreshPositions();
          },
        };

        if (layoutInfo !== undefined && Object.keys(layoutInfo).length > 0) {
          graph.updateLayout(layoutInfo);
        } else {
          layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
          layout.instance = new G6.Layout["gForce"](layoutConfig);
          layout.instance.init({
            nodes: dbdata.nodes,
            edges: dbdata.edges,
          });
          layout.instance.execute();
        }

        bindListener(
          graph,
          shiftKeydown,
          layout,
          clearFocusEdgeState,
          clearFocusItemState,
          dispatch,
        );
        if (typeof window !== "undefined")
          window.onresize = () => {
            if (!graph || graph.get("destroyed")) return;
            if (!container || !container.scrollWidth || !container.scrollHeight)
              return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          };

        return () => {
          // 销毁G6图形实例
          graph.destroy();
        };
      }
    }
  }, [layoutInfo, loaddata, dbdata, isMapModel]);

  return (
    <Grid container className="kgBackground">
      {loaddata ? <></> : <Loading></Loading>}
      {isMapModel ? <MapContainer></MapContainer> : <></>}
      <div ref={myRef} className="kgContainer" id="container"></div>
      <LeftDrawer></LeftDrawer>
      <RightTopStatistic></RightTopStatistic>
    </Grid>
  );
}

export default App;
