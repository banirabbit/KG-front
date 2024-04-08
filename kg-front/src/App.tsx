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
  clearSearchNodes,
  executeNeo4jQueryNode,
  fetchData,
  fetchTotalNumber,
  getCitys,
  getLength,
  setLoading,
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
import InfoAlert from "./components/Alert/InfoAlert";
import zIndex from "@mui/material/styles/zIndex";
import { setBigModel } from "./actions/layoutAction";
import WarnAlert from "./components/Alert/WarnAlert";

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
  const toolbarRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  let CANVAS_WIDTH: number;
  let CANVAS_HEIGHT: number;
  let shiftKeydown = false;
  const [layout, setLayout] = useState<any>({});
  const [graphConfig, setGraphConfig] = useState<any>({});
  const { layoutInfo, isBigModel, focusNode } = useSelector(
    (state: AppState) => state.Layout
  );
  const {
    appendData,
    searchNodes,
    isMapModel,
    relationships,
    selectedNodes,
    loading,
  } = useSelector((state: AppState) => state.GraphData);
  const [alertOpen, setAlertOpen] = useState(false);
  const [warnalert, setWarnAlertOpen] = useState(false);
  const dispatch = useDispatch();
  RegisterEdgeStyle();
  useEffect(() => {
    // 调用查询函数
    executeNeo4jQueryNode(driver, session, dispatch, relationships)
      .then((data) => {
        let isBig = data.nodes.length > 400 ? true : false;
        dispatch(setBigModel(isBig));
        const { edges: processEdges, nodes: processNodes } = processNodesEdges(
          data.nodes,
          data.edges,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          false,
          true,
          isBig
        );
        setDBData({ nodes: processNodes, edges: processEdges });
        console.log(processEdges, processNodes);
        dispatch(setLoading(true));
       // dispatch(getCitys());
      })
      .catch((error) => console.error("Error executing Neo4j query:", error))
      .finally(() => {
        // 确保在所有操作结束后关闭 driver
        driver.close();
      });   
          
  }, [relationships]);
  useEffect(() => {
    dispatch(fetchTotalNumber());
    
  }, [])
  //展开节点
  useEffect(() => {
    if (appendData !== undefined && Object.keys(appendData).length > 0) {
      let temp = {
        nodes: [...dbdata.nodes, ...appendData.nodes],
        edges: [...dbdata.edges, ...appendData.edges],
      };
      //检查节点是否都在图中，都在的话就不展开了
      let isContain;

      const Id = new Set(dbdata.nodes.map((item: any) => item.id));
      isContain = temp.nodes.every((item) => Id.has(item.id));
      if (!isContain) {
        const { edges: processEdges, nodes: processNodes } = processNodesEdges(
          temp.nodes,
          temp.edges,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          false,
          true,
          isBigModel
        );
        setDBData({ nodes: processNodes, edges: processEdges });
      } else {
        setWarnAlertOpen(true);
      }
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
      let temp;
      if (dbdata.nodes !== undefined && dbdata.nodes.length !== 0) {
        //搜索结果是否已经有部分在图中
        const hasCommonId = dbdata.nodes.some((itemA: any) =>
          searchNodes.some((itemB: any) => itemA.id === itemB.id)
        );
        if (hasCommonId) {
          temp = {
            nodes: [...dbdata.nodes, ...searchNodes],
            edges: dbdata.edges,
          };
        } else {
          //如果都不在图中，就只显示搜索结果
          temp = {
            nodes: searchNodes,
            edges: [],
          };
        }
      } else {
        temp = {
          nodes: searchNodes,
          edges: [],
        };
      }
      //检查搜索后是否是大规模视图
      let isBig = temp.nodes.length > 400 ? true : false;
      dispatch(setBigModel(isBig));
      //为新节点设置样式并去重
      const { edges: processEdges, nodes: processNodes } = processNodesEdges(
        temp.nodes,
        temp.edges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true,
        isBig
      );
      setDBData({ nodes: processNodes, edges: processEdges });
      dispatch(setLoading(true));
      console.log("search result:", processNodes, processEdges);
    }
  }, [searchNodes]);
  useEffect(() => {
    if (loading) {
      const container = myRef.current;
      if (container === null || container === undefined) {
        throw new Error(
          "Container not found. Make sure to set the containerRef."
        );
      }
      const toolbarContainer = toolbarRef.current;
      if (toolbarContainer === null || toolbarContainer === undefined) {
        throw new Error(
          "ToolBARContainer not found. Make sure to set the containerRef."
        );
      }
      const miniMapContainer = miniMapRef.current;
      if (miniMapContainer === null || miniMapContainer === undefined) {
        throw new Error(
          "miniMapContainer not found. Make sure to set the containerRef."
        );
      }
      if (!isMapModel) {
        const miniMap = new G6.Minimap({ container: miniMapContainer });
        const grid = new G6.Grid();
        const toolbar = new G6.ToolBar({ container: toolbarContainer });

        CANVAS_WIDTH = container.scrollWidth;
        CANVAS_HEIGHT = (container.scrollHeight || 500) - 30;
        const graph = new G6.Graph({
          container,
          linkCenter: true,
          minZoom: 0.1,
          modes: {
            default: ["drag-canvas", "zoom-canvas"],
          },
          animate: true,
          plugins: [toolbar, miniMap, grid],
        });
        graph.data(dbdata);

        const layoutConfig: any = {
          type: "gForce",
          minMovement: 0.5,
          maxIteration: 5000,
          preventOverlap: true,
          damping: 0.6,
          linkdistance: 400,
          fitView: true,
          tick: () => {
            graph.refreshPositions();
          },
        };
        //bindListener需要当前layout的参数，暂时保存值
        const tempLayout: any = {};
        //更换布局的情况
        if (layoutInfo !== undefined && Object.keys(layoutInfo).length > 0) {
          //如果更换了力导向布局
          if (layoutInfo.type === "gForce") {
            layoutInfo.tick = () => {
              graph.refreshPositions();
            };
            //大规模下改成force2布局
            if (isBigModel) {
              setAlertOpen(true);
              graph.updateLayout({
                type: "force2",
                workerEnabled: true,
                onLayoutEnd: () => {
                  setAlertOpen(false);
                },
              });
            } else {
              const instance = new G6.Layout[layoutInfo.type](layoutInfo);
              setLayout({
                instance: instance,
              });
              instance.init({
                nodes: dbdata.nodes,
                edges: dbdata.edges,
              });
              instance.execute();
            }
          } else {
            //不是力导向布局，要先停止布局不然会出bug
            if (layout !== undefined && layout.instance !== undefined) {
              layout.instance.stop();
              if (isBigModel) {
                setAlertOpen(true);
                layoutInfo.onLayoutEnd = () => {
                  setAlertOpen(false);
                };
              }
              graph.updateLayout(layoutInfo);
            }
          }
        } else {
          //初始情况
          if (!isBigModel) {
            layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];

            tempLayout.instance = new G6.Layout["gForce"](layoutConfig);
            setLayout(tempLayout);
            tempLayout.instance.init({
              nodes: dbdata.nodes,
              edges: dbdata.edges,
            });
            tempLayout.instance.execute();
          } else {
            //大规模数据初始情况
            setAlertOpen(true);
            graph.updateLayout({
              type: "force2",
              workerEnabled: true,
              onLayoutEnd: () => {
                setAlertOpen(false);
              },
            });
          }
        }

        graph.render();

        bindListener(
          graph,
          shiftKeydown,
          tempLayout,
          clearFocusEdgeState,
          clearFocusItemState,
          dispatch
        );
        if (searchNodes !== undefined && searchNodes.length > 0) {
          //找到搜索结果（图的节点信息和处理过后数据的信息不一样，所以要重新找）
          const searchItem: any[] = graph.findAll("node", (node) => {
            return searchNodes.some(
              (itemB: any) => node.get("id") === itemB.id
            );
          });
          if (searchItem !== undefined && searchItem.length > 0) {
            searchItem.forEach((item) =>
              graph.setItemState(item, "focus", true)
            );
            graph.focusItem(searchItem[0], true, {
              easing: "easeCubic",
              duration: 400,
            });
          }
          //清除所有搜索状态
          dispatch(clearSearchNodes([]));
        } else if (dbdata.nodes.length === 1) {
          graph.focusItem(graph.getNodes()[0], true, {
            easing: "easeCubic",
            duration: 400,
          });
        } else if (
          focusNode !== undefined &&
          Object.keys(focusNode).length > 0
        ) {
          //需要获取刷新后该节点的信息
          const item = graph.findById(focusNode);
          graph.setItemState(item, "focus", true);
          graph.focusItem(item, true, {
            easing: "easeCubic",
            duration: 400,
          });
        }
        setGraphConfig(graph);
        if (typeof window !== "undefined" && !isMapModel)
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
  }, [layoutInfo, loading, dbdata, isMapModel]);

  return (
    <Grid container className="kgBackground">
      {loading ? <></> : <Loading></Loading>}
      {isMapModel ? <MapContainer></MapContainer> : <></>}
      <div ref={myRef} className="kgContainer" id="container"></div>
      <LeftDrawer></LeftDrawer>
      <RightTopStatistic></RightTopStatistic>
      <div ref={toolbarRef} className="ToolbarContainer"></div>
      <div ref={miniMapRef} className="MiniMapContainer"></div>
      <InfoAlert
        text={"布局中，请稍侯..."}
        open={alertOpen}
        setOpen={setAlertOpen}
      ></InfoAlert>
      <WarnAlert
        text={"无新节点"}
        open={warnalert}
        setOpen={setWarnAlertOpen}
      ></WarnAlert>
    </Grid>
  );
}

export default App;
