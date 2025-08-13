import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { data } from "./data";
import G6, { Graph } from "@antv/g6";
import ControlledOpenSpeedDial from "./components/ControlledOpenSpeedDial";
import { Container, Grid } from "@mui/material";
import LeftDrawer from "./components/LeftDrawer/LeftDrawer";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./store";
import {
  AppendNode,
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

import { setBigModel, setfocusNode } from "./actions/layoutAction";
import WarnAlert from "./components/Alert/WarnAlert";
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
} from "@cosmograph/react";
import { convertData } from "./converData";

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
  const viewRef = useRef<HTMLDivElement>(null);
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
  const [cosmdata, setCosmData] = useState<{ nodes: any[]; edges: any[] }>();
  const cosmographRef = useRef<CosmographRef>(null);
  RegisterEdgeStyle();
  useEffect(() => {
    // 调用查询函数
    executeNeo4jQueryNode(driver, session, dispatch, relationships)
      .then((data) => {
        let isBig = data.nodes.length > 400 ? true : false;
        dispatch(setBigModel(isBig));
        const { edges, nodes } = processNodesEdges(
          data.nodes,
          data.edges,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          false,
          true,
          isBig
        );
        setDBData({ nodes, edges });
        console.log(convertData(nodes, edges));
        setCosmData(convertData(nodes, edges));
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
  }, []);
  const [menuAction, setMenuAction] = useState<{
    type: string;
    nodeId: string;
  } | null>(null);

  useEffect(() => {
    if (!menuAction) return;

    const { type, nodeId } = menuAction;

    if (type === "收起") {
      dispatch(setfocusNode(nodeId));
      const removeIds = dbdata.nodes
        .filter((n: any) => n.parentId === nodeId)
        .map((n: any) => n.id);

      const newNodes = dbdata.nodes
        .filter((n: any) => !removeIds.includes(n.id))
        .map((n: any) => (n.id === nodeId ? { ...n, expanded: false } : n));

      const newEdges = dbdata.edges.filter(
        (e: any) =>
          !removeIds.includes(e.source) && !removeIds.includes(e.target)
      );

      setDBData({ nodes: newNodes, edges: newEdges });
    } else if (type === "展开") {
      dispatch(setfocusNode(nodeId));
      AppendNode(nodeId)(dispatch);
    }

    // 执行完重置
    setMenuAction(null);
  }, [menuAction, dbdata, dispatch]);
  //展开节点
  useEffect(() => {
    if (appendData !== undefined && Object.keys(appendData).length > 0) {
      let temp = {
        nodes: [
          ...dbdata.nodes,
          ...appendData.nodes.map((a_node: any) => ({
            ...a_node,
            parentId: focusNode, // 给所有 appendData.nodes 加 parentId
          })),
        ],
        edges: [...dbdata.edges, ...appendData.edges],
      };
      //检查节点是否都在图中，都在的话就不展开了
      let isContain;

      const Id = new Set(dbdata.nodes.map((item: any) => item.id));
      isContain = temp.nodes.every((item) => Id.has(item.id));
      if (!isContain) {
        temp = {
          ...temp,
          nodes: temp.nodes.map((node) =>
            node.id === focusNode ? { ...node, expanded: true } : node
          ),
        };
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
      const viewMapContainer = viewRef.current;
      if (viewMapContainer === null || viewMapContainer === undefined) {
        throw new Error(
          "viewMapContainer not found. Make sure to set the containerRef."
        );
      }
      if ((!isMapModel && !isBigModel) || viewClick) {
        const toolbar = new G6.ToolBar({ container: toolbarContainer });

        CANVAS_WIDTH = container.scrollWidth;
        CANVAS_HEIGHT = (container.scrollHeight || 500) - 30;
        const contextMenu = new G6.Menu({
          trigger: 'contextmenu',   // 显式右键触发
          offsetX: 6,
          offsetY: 6,
          itemTypes: ["node"],

          getContent: (evt: any) => {
            const cfg = evt.item.getModel();
            console.log(cfg);
            if (cfg.expanded || cfg.expended === false) {
              return `<span id="uncombo">收起</span>`;
            }
            return `<span id="recombo">展开</span>`;
          },
          handleMenuClick: (target, item) => {
            const id = item.getID();
            setMenuAction({ type: target.innerHTML, nodeId: id });
          },
        });
        const graph = new G6.Graph({
          container: viewClick ? viewMapContainer : container,
          linkCenter: true,
          minZoom: 0.1,
          modes: {
            default: ["drag-canvas", "zoom-canvas"],
          },
          animate: true,
          plugins: [toolbar, contextMenu],
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
        // if (typeof window !== "undefined" && !isMapModel && !isBigModel) {
        //   window.onresize = () => {
        //     if (!graph || graph.get("destroyed")) return;
        //     if (!container || !container.scrollWidth || !container.scrollHeight)
        //       return;
        //     graph.changeSize(container.scrollWidth, container.scrollHeight);
        //   };
        // }
        return () => {
          // 销毁G6图形实例
          graph.destroy();
        };
      } else if (isBigModel) {
      }
    }
  }, [layoutInfo, loading, dbdata, isMapModel]);
  //判断当前屏幕中的节点数，查看细节
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [viewDetail, setViewDetail] = useState(false);
  const [viewClick, setViewClick] = useState(false);
  const [oriDBdata, setOriDBdata] = useState<{ nodes: any[]; edges: any[] }>(); //切换视图之前保存原始数据
  const cosmoContainerRef = useRef<HTMLDivElement | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const WHEEL_IDLE_MS = 1000; // 停止滚动 1 秒后执行
  useEffect(() => {
    // 优先绑定到当前“可滚动/接收滚轮”的容器：大图用 Cosmograph 容器，小图用 G6 容器
    const target: EventTarget =
      (isBigModel ? cosmoContainerRef.current : myRef.current) ?? window;

    const onWheel = () => {
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        // Cosmograph 模式下才有 getSampledNodePositionsMap；没有就直接返回
        const map = cosmographRef.current?.getSampledNodePositionsMap?.();
        if (!map) return;
        setViewDetail(map.size <= 200);
      }, WHEEL_IDLE_MS);
    };

    // 用 capture 拦截，避免被图形库阻断；passive 提升滚动性能
    target.addEventListener("wheel", onWheel as EventListener, {
      capture: true,
      passive: true,
    });

    return () => {
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      target.removeEventListener(
        "wheel",
        onWheel as EventListener,
        { capture: true } as any
      );
    };
  }, [isBigModel]); // 切换视图时重绑
  useEffect(() => {
    if (viewClick) {
      let screenNodeMap = cosmographRef.current?.getSampledNodePositionsMap();
      let tempNodes = dbdata.nodes.filter(function (item: any) {
        if (screenNodeMap?.has(item.id)) {
          let temp: number[] | undefined = screenNodeMap.get(item.id);
          if (temp !== undefined) {
            item.x = temp[0];
            item.y = temp[1];
            return item;
          }
        }
      });
      let tempEdges = dbdata.edges.filter(function (item: any) {
        if (
          screenNodeMap?.has(item.source) &&
          screenNodeMap?.has(item.target)
        ) {
          return item;
        }
      });
      console.log(tempNodes, tempEdges);
      const { edges, nodes } = processNodesEdges(
        tempNodes,
        tempEdges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true,
        false
      );
      setOriDBdata(dbdata);
      setDBData({ nodes, edges });
    } else if (oriDBdata !== undefined) {
      setDBData(oriDBdata);
    }
  }, [viewClick]);

  return (
    <Grid container className="kgBackground">
      {loading ? <></> : <Loading></Loading>}
      {isBigModel ? (
        <div ref={cosmoContainerRef} style={{ height: "100%", width: "100%" }}>
          <CosmographProvider
            nodes={cosmdata !== undefined ? cosmdata.nodes : []}
            links={cosmdata !== undefined ? cosmdata.edges : []}
          >
            <Cosmograph
              ref={cosmographRef}
              nodeSize={(d: any) => d.size}
              nodeLabelAccessor={(d: any) => d.label}
              nodeColor={(d: any) => d.color}
              simulationFriction={1}
              simulationLinkSpring={0.1}
              simulationLinkDistance={20}
              simulationRepulsion={1}
              simulationDecay={8000}
              simulationGravity={0.05}
              nodeLabelColor={"#D4D4D4"}
              hoveredNodeLabelColor={"#FFDA4A"}
              disableSimulation={false}
              nodeSamplingDistance={1}
              fitViewOnInit={true}
              backgroundColor={"#363B46"}
            />
          </CosmographProvider>
        </div>
      ) : (
        <></>
      )}
      <div ref={myRef} className="kgContainer" id="container"></div>
      <LeftDrawer></LeftDrawer>
      <RightTopStatistic
        viewDetail={viewDetail}
        viewClick={viewClick}
        setViewClick={setViewClick}
      ></RightTopStatistic>
      <div ref={toolbarRef} className="ToolbarContainer"></div>
      <div ref={miniMapRef} className="MiniMapContainer"></div>
      {/* 大数据模式使用g6查看详细情况的容器 */}
      <div
        className="viewContainer"
        ref={viewRef}
        style={{ zIndex: viewClick ? 99 : -1 }}
      ></div>{" "}
      : <></>
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
