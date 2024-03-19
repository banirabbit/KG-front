import G6 from "@antv/g6";
import companysvg from "./icons/company.svg";
import documentsvg from "./icons/document.svg";
import peoplesvg from "./icons/user.svg";
import acceptsvg from "./icons/accept.svg";
import atom from "./icons/atom.svg";
import { Opacity, Visibility } from "@mui/icons-material";
import { AppendNode, setSelectInfo, setSelectedNode } from "./actions/dataAction";
import { setfocusNode } from "./actions/layoutAction";
const { uniqueId } = G6.Util;
let selectedNodes = 0;
const lightColors = [
  '#8FE9FF',
  '#87EAEF',
  '#FFC9E3',
  '#A7C2FF',
  '#FFA1E3',
  '#FFE269',
  '#BFCFEE',
  '#FFA0C5',
  '#D5FF86',
];
const darkColors = [
  '#7DA8FF',
  '#44E6C1',
  '#FF68A7',
  '#7F86FF',
  '#AE6CFF',
  '#FF5A34',
  '#5D7092',
  '#FF6565',
  '#6BFFDE',
];
const uLightColors = [
  '#CFF6FF',
  '#BCFCFF',
  '#FFECF5',
  '#ECFBFF',
  '#EAD9FF',
  '#FFF8DA',
  '#DCE2EE',
  '#FFE7F0',
  '#EEFFCE',
];
const uDarkColors = [
  '#CADBFF',
  '#A9FFEB',
  '#FFC4DD',
  '#CACDFF',
  '#FFD4F2',
  '#FFD3C9',
  '#EBF2FF',
  '#FFCBCB',
  '#CAFFF3',
];
const gColors:any[] = [];
const unlightColorMap = new Map();

export const descendCompare = (p: string) => {
  // 这是比较函数
  return function (m: any, n: any) {
    const a = m[p];
    const b = n[p];
    return b - a; // 降序
  };
};
const refreshDragedNodePosition = (e:any) =>{
  
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}
export const clearFocusItemState: (arg0: any) => void = (graph: any) => {
  if (!graph) return;
  clearFocusNodeState(graph);
  clearFocusEdgeState(graph);
};
// 清除图上所有节点的 focus 状态及相应样式
export const clearFocusNodeState: (arg0: any) => void = (graph: any) => {
  const focusNodes = graph.findAllByState("node", "focus");
  focusNodes.forEach((fnode: any) => {
    graph.setItemState(fnode, "focus", false); // false
  });
};

// 清除图上所有边的 focus 状态及相应样式
export const clearFocusEdgeState: (arg0: any) => void = (graph: any) => {
  const focusEdges = graph.findAllByState("edge", "focus");
  focusEdges.forEach((fedge: any) => {
    graph.setItemState(fedge, "focus", false);
  });
};

//监听鼠标操作
export function bindListener(
  graph: any,
  shiftKeydown: Boolean,
  layout: any,
  clearFocusEdgeState: (arg0: any) => void,
  clearFocusItemState: (arg0: any) => void,
  dispatch: Function,
) {
  const nodes = graph.getNodes();
  const edges = graph.getEdges();
  graph.on("keydown", (evt: any) => {
    const code = evt.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === "shift") {
      shiftKeydown = true;
    } else {
      shiftKeydown = false;
    }
  });
  graph.on("keyup", (evt: any) => {
    const code = evt.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === "shift") {
      shiftKeydown = false;
    }
  });
  graph.on("node:mouseenter", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    model.oriFontSize = model.labelCfg.style.fontSize;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
    item.toFront();
  });

  graph.on("node:mouseleave", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
     item.update({
       label: model.oriLabel,
     });
    model.oriLabel = currentLabel;
  });

  graph.on("edge:mouseenter", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
   item.toFront();
     item.getSource().toFront();
     item.getTarget().toFront();
  });

  graph.on("edge:mouseleave", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
  });
  // click node to show the detail drawer
  graph.on("node:click", (evt: any) => {
    if (layout.instance !== undefined) {
      layout.instance.stop();
    }
    if (!shiftKeydown) {
      clearFocusItemState(graph);
      selectedNodes = 1;
      dispatch(setSelectedNode(selectedNodes));
    } else {clearFocusEdgeState(graph);
      selectedNodes++;
      dispatch(setSelectedNode(selectedNodes));
    }
    const { item } = evt;
    console.log(item._cfg)
    if(item._cfg.model !== undefined) {
      dispatch(setSelectInfo(item._cfg.model));
    }
    //降低所有未选中节点透明度
    nodes.forEach((node: Array<Object>) => {
      graph.setItemState(node, "opacity", true);
    });
    // highlight the clicked node, it is down by click-select
    graph.setItemState(item, "focus", true);
    
    // if (!shiftKeydown) {
    //   // 将相关边也高亮
    //   const relatedEdges = item.getEdges();
    //   relatedEdges.forEach((edge: Array<Object>) => {
    //     graph.setItemState(edge, "focus", true);
    //   });
    // }
  });
  graph.on("node:dblclick", (evt: any) => {
    const { item } = evt;
    const cfg = item._cfg;
    clearFocusItemState(graph);
    selectedNodes = 0;
    dispatch(setSelectedNode(0));
    nodes.forEach((node: Array<object>) =>
      graph.setItemState(node, "opacity", false)
    );
    
    
    dispatch(setfocusNode(cfg.id));
    AppendNode(cfg.id)(dispatch);
    
  });
  // click edge to show the detail of integrated edge drawer
  graph.on("edge:click", (evt: any) => {
    if (layout.instance !== undefined) {
      layout.instance.stop();
    }
    if (!shiftKeydown) clearFocusItemState(graph);
    const { item } = evt;
    // highlight the clicked edge
    graph.setItemState(item, "focus", true);
  });

  // click canvas to cancel all the focus state
  graph.on("canvas:click", (evt: any) => {
    clearFocusItemState(graph);
    selectedNodes = 0;
    dispatch(setSelectedNode(0));
    nodes.forEach((node: Array<object>) =>
      graph.setItemState(node, "opacity", false)
    );
    console.log(
      graph.getGroup(),
      graph.getGroup().getBBox(),
      graph.getGroup().getCanvasBBox()
    );
  });
  graph.on('node:dragstart', (e:any) => {
    
    refreshDragedNodePosition(e);
  });
  graph.on('node:drag', (e:any) => {
    console.log("drag");
    refreshDragedNodePosition(e);
    console.log(e)
  });
  graph.on('node:dragend', (e:any) => {

    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
    
  });
}
// 截断长文本。length 为文本截断后长度，elipsis 是后缀
export const formatText = (text: string, length = 5, elipsis = "...") => {
  if (!text) return "";
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};

export const labelFormatter = (text: string, minLength = 10) => {
  if (text && text.split("").length > minLength)
    return `${text.substr(0, minLength)}...`;
  return text;
};

export const processNodesEdges = (
  nodes: Array<any>,
  edges: Array<any>,
  width: number,
  height: number,
  largeGraphMode: boolean,
  edgeLabelVisible: boolean,
  isBigModel:boolean,
) => {
  if (!nodes || nodes.length === 0) return {};
  const currentNodeMap: any = {};
  let maxNodeCount = -Infinity;
  const paddingRatio = 0.3;
  const paddingLeft = paddingRatio * width;
  const paddingTop = paddingRatio * height;
  //移除重复结点
  const removeNodes: any[] = [];
  //颜色设置
  lightColors.forEach((lcolor, i) => {
    gColors.push('l(0) 0:' + lcolor + ' 1:' + darkColors[i]);
    unlightColorMap.set(gColors[i], 'l(0) 0:' + uLightColors[i] + ' 1:' + uDarkColors[i]);
    });
  nodes.forEach((node) => {
    node.type = isBigModel ? "bigModel-node" : "real-node";
    node.labelLineNum = undefined;
    node.oriLabel = node.name;
    node.label = formatText(node.name, 5, "...");
    node.degree = 0;
    node.inDegree = 0;
    node.outDegree = 0;
    node.style = {};
    switch (node.group) {
      case "企业":
        node.style.fill = gColors[1];//"#5479A6";
        node.img = companysvg;
        break;
      case "专利":
        node.style.fill = gColors[0];// "#ED8F31";
        node.img = acceptsvg;
        break;
      case "人":
        node.style.fill = gColors[4];//"#7AB7B2";
        node.img = peoplesvg;
        break;
      case "招投标":
        node.style.fill = gColors[3];;
        node.img = documentsvg;
        break;
      default:
        node.style.fill = gColors[5];;
        node.img = atom;
    }
    if (currentNodeMap[node.id]) {
      console.warn("node exists already!", node.id);
      removeNodes.push(node);
    }
    currentNodeMap[node.id] = node;
    // if (node.count > maxNodeCount) maxNodeCount = node.count;
    // const cachePosition = cachePositions ? cachePositions[node.id] : undefined;
    // if (cachePosition) {
    //   node.x = cachePosition.x;
    //   node.y = cachePosition.y;
    //   node.new = false;
    // } else {
    //   node.new = isNewGraph ? false : true;
    //   if (manipulatePosition && !node.x && !node.y) {
    //     node.x =
    //       manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
    //     node.y =
    //       manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    //   }
    // }
  });

  let maxCount = -Infinity;
  let minCount = Infinity;
  // let maxCount = 0;
  edges.forEach((edge) => {
    // to avoid the dulplicated id to nodes
    if (!edge.id) edge.id = uniqueId("edge");
    else if (edge.id.split("-")[0] !== "edge") edge.id = `edge-${edge.id}`;
    // TODO: delete the following line after the queried data is correct
    if (!currentNodeMap[edge.source] || !currentNodeMap[edge.target]) {
      console.warn(
        "edge source target does not exist",
        edge.source,
        edge.target,
        edge.id
      );
      return;
    }
    const sourceNode = currentNodeMap[edge.source];
    const targetNode = currentNodeMap[edge.target];

    if (!sourceNode || !targetNode)
      console.warn(
        "source or target is not defined!!!",
        edge,
        sourceNode,
        targetNode
      );

    // calculate the degree
    sourceNode.degree++;
    targetNode.degree++;
    sourceNode.outDegree++;
    targetNode.inDegree++;

    //    if (edge.count > maxCount) maxCount = edge.count;
    //    if (edge.count < minCount) minCount = edge.count;
  });
  let tempnodes:any[] = [];
  nodes.forEach((item) => tempnodes.push(item));
  tempnodes.sort(descendCompare("degree"));
  const maxDegree = tempnodes[0].degree || 1;

  const descreteNodes: Array<any> = [];
  nodes.forEach((node, i) => {
    // assign the size mapping to the outDegree
    // const countRatio = node.count / maxNodeCount;
    const isRealNode = node.degree > 1 ? true : false;
    const maxSize = isBigModel ? 30 : 60;
    const minSize = isBigModel ? 10 : 35;
    node.size = (node.degree / maxDegree) * (maxSize - minSize) + minSize;
    node.isReal = isRealNode;
    node.labelCfg = isBigModel
      ? {
          style: {
            fontSize: 3,
          },
          position: "right",
          offset: 1,
        }
      : {
          position: "bottom",
          offset: 5,
          style: {
            fill: "#616161",
            fontSize: 14,
            //        stroke: global.node.labelCfg.style.stroke,
            lineWidth: 3,
          },
        };

    if (!node.degree) {
      descreteNodes.push(node);
    }
  });

  //  const countRange = maxCount - minCount;
  const minEdgeSize = 1;
  const maxEdgeSize = 7;
  const edgeSizeRange = maxEdgeSize - minEdgeSize;
  edges.forEach((edge) => {
    // set edges' style
    const targetNode = currentNodeMap[edge.target];

    // const size =
    //   ((edge.count - minCount) / countRange) * edgeSizeRange + minEdgeSize || 1;
    // edge.size = size;

    //const arrowWidth = Math.max(size / 2 + 2, 3);
    const arrowWidth = 3;
    const arrowLength = 10;
    const arrowBeging = targetNode.size + arrowLength;
    let arrowPath: string | undefined = `M ${arrowBeging},0 L ${
      arrowBeging + arrowLength
    },-${arrowWidth} L ${arrowBeging + arrowLength},${arrowWidth} Z`;
    let d = targetNode.size / 2 + arrowLength;
    if (edge.source === edge.target) {
      edge.type = "loop";
      arrowPath = undefined;
    } else {
      edge.type = "cubic";
    }
    const sourceNode = currentNodeMap[edge.source];
    // const isRealEdge = targetNode.isReal && sourceNode.isReal;
    // edge.isReal = isRealEdge;
    // const stroke = isRealEdge
    //   ? global.edge.style.realEdgeStroke
    //   : global.edge.style.stroke;
    // const opacity = isRealEdge
    //   ? global.edge.style.realEdgeOpacity
    //   : global.edge.style.strokeOpacity;
    // const dash = Math.max(size, 2);
    // const lineDash = isRealEdge ? undefined : [dash, dash];
    // edge.style = {
    //   stroke,
    //   strokeOpacity: opacity,
    //   cursor: "pointer",
    //   lineAppendWidth: Math.max(edge.size || 5, 5),
    //   fillOpacity: 1,
    //   lineDash,
    //   endArrow: arrowPath
    //     ? {
    //         path: arrowPath,
    //         d,
    //         fill: stroke,
    //         strokeOpacity: 0,
    //       }
    //     : false,
    // };
    edge.style = isBigModel
      ? {
          lineWidth: 0.5,
          cursor: "pointer",
          opacity: 0.8,
          stroke: gColors[1],
          size: 0.1,
        }
      : {
          endArrow: {
            path: arrowPath,
            d,
            fill: gColors[1],
            strokeOpacity: 0,
            opacity: 0.7,
          },
          lineWidth: 2,
          cursor: "pointer",
          opacity: 0.3,
          stroke:  gColors[1],
        };
    edge.labelCfg = isBigModel
      ? { style: { opacity: 0 } }
      : {
          autoRotate: true,
          style: {
            fill: "#fff",
            lineWidth: 4,
            fontSize: 12,
            lineAppendWidth: 5,
            opacity: 1,
          },
        };
    if (!edge.oriLabel) edge.oriLabel = edge.label;
    if (largeGraphMode || !edgeLabelVisible) edge.label = "";
    else {
      edge.label = labelFormatter(edge.label, 5);
    }

    // arrange the other nodes around the hub
    const sourceDis = sourceNode.size / 2 + 20;
    const targetDis = targetNode.size / 2 + 20;
    if (sourceNode.x && !targetNode.x) {
      targetNode.x =
        sourceNode.x + sourceDis * Math.cos(Math.random() * Math.PI * 2);
    }
    if (sourceNode.y && !targetNode.y) {
      targetNode.y =
        sourceNode.y + sourceDis * Math.sin(Math.random() * Math.PI * 2);
    }
    if (targetNode.x && !sourceNode.x) {
      sourceNode.x =
        targetNode.x + targetDis * Math.cos(Math.random() * Math.PI * 2);
    }
    if (targetNode.y && !sourceNode.y) {
      sourceNode.y =
        targetNode.y + targetDis * Math.sin(Math.random() * Math.PI * 2);
    }

    // if (!sourceNode.x && !sourceNode.y && manipulatePosition) {
    //   sourceNode.x =
    //     manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
    //   sourceNode.y =
    //     manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    // }
    // if (!targetNode.x && !targetNode.y && manipulatePosition) {
    //   targetNode.x =
    //     manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
    //   targetNode.y =
    //     manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
    // }
  });

  // descreteNodeCenter = {
  //   x: width - paddingLeft,
  //   y: height - paddingTop,
  // };
  // descreteNodes.forEach((node) => {
  //   if (!node.x && !node.y) {
  //     node.x =
  //       descreteNodeCenter.x + 30 * Math.cos(Math.random() * Math.PI * 2);
  //     node.y =
  //       descreteNodeCenter.y + 30 * Math.sin(Math.random() * Math.PI * 2);
  //   }
  // });
  nodes = nodes.filter((item) => !removeNodes.includes(item));
  G6.Util.processParallelEdges(edges, 12.5, "custom-quadratic", "custom-line");
  return {
    maxDegree,
    nodes,
    edges,
  };
};
