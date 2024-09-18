import { People } from "../components/Nodes/PeopleNode";
import { createNodeFromReact } from "@antv/g6-react-node";
import G6 from "@antv/g6";
import axiosInstance from "./instance";
export const GET_GRAPHDATA = "GET_GRAPHDATA";
export const GET_SEARCH = "GET_SEARCH";
export const GET_APPENDNODE = "GET_APPENDNODE";
export const GET_CITYS = "GET_CITYS";
export const SET_MAPMODEL = "SET_MAPMODEL";
export const GET_LENGTH = "GET_LENGTH";
export const SET_RELA = "SET_RELA";
export const SET_SELECTNODE = "SET_SELECTNODE";
export const SET_SELECTINFO = "SET_SELECTINFO";
export const SET_LOADING = "SET_LOADING";
export const GET_TOTALNUM = "GET_TOTALNUM";
interface GraphData {
  m: any;
  n: any;
  r: any;
}
export const handleElementId = (record: any) => {
  //提取id
  let inputString = record.elementId;
  let secondColonIndex = inputString.indexOf(":", inputString.indexOf(":") + 1);
  let id: any;
  if (secondColonIndex !== -1) {
    id = inputString.substring(secondColonIndex + 1);
  } else {
    id = inputString;
  }
  return id;
};
//处理neo4j返回的原始数据 nodes:已有的节点数组，用于查重 node:从neo4j返回的数据
export const handleNativeData = (nodes: Array<any>, record: any) => {
  //节点类型
  const group = record.labels[0];
  //提取节点id
  let nodeid = handleElementId(record);
  const node = {
    ...record.properties,
    label: record.properties.name,
    group: group,
    id: nodeid,
  };
  //检查是否已经处理过该节点
  //如果重复出现则不是叶节点，更新信息
  let existingNodeIndex = nodes.findIndex(
    (existingNode) => existingNode.id === node.id
  );
  if (existingNodeIndex !== -1) {
    nodes[existingNodeIndex] = {
      ...nodes[existingNodeIndex],
    };
  } else {
    nodes.push(node);
  }
  return node;
};
export async function executeNeo4jQueryNode(
  driver: any,
  session: { run: (arg0: string) => any; close: () => any },
  dispatch: Function,
  relationships: number
) {
  try {
    const cypher = "MATCH (m)-[r]-(n) RETURN m, r, n LIMIT " + relationships;
    const result = await session.run(cypher);
    const data = result.records.map((record: { toObject: () => any }) =>
      record.toObject()
    );
    console.log("origin data:", data);
    // 处理数据
    const nodes: string | any[] = [];
    const edges:
      | string
      | {
          id: any;
          source: any; // 假设节点有一个属性为 id
          target: any;
          label: any;
        }[] = [];

    data.forEach((record: GraphData) => {
      // 提取节点
      const node = handleNativeData(nodes, record.m);
      const relatedNode = handleNativeData(nodes, record.n);
      //提取边id

      const edgeid = handleElementId(record.r);
      const existingEdgeIndex = edges.findIndex(
        (existingEdge) => existingEdge.id === edgeid
      );
      if (existingEdgeIndex === -1) {
        edges.push({
          id: edgeid,
          source: node.id, // 假设节点有一个属性为 id
          target: relatedNode.id,
          label: record.r.type,
        });
      }
    });
    dispatch({
      type: GET_GRAPHDATA,
      data: {
        nodes,
        edges,
      },
    });
    return {
      nodes,
      edges,
    };
  } finally {
    // 确保在查询结束后关闭 session
    await session.close();
  }
}
//nodejs测试
export const fetchData = async () => {
  try {
    const response = await axiosInstance.get("getNodes");
    if (response.status === 200) {
      const data = response.data;
      console.log("origin data:", data);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
//节点总数
export const fetchTotalNumber = () => async (dispatch: Function) => {
  try {
    const response = await axiosInstance.get("maxNodeNumber");
    if (response.status === 200) {
      dispatch({
        type: GET_TOTALNUM,
        data: response.data.low,
      });
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
//搜索
export const SearchNodeName =
  (searchTerm: string) => async (dispatch: Function) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { searchTerm: searchTerm },
      });
      if (response.status === 200) {
        const data = response.data;
        const nodes: any[] = [];
        console.log(data);
        data.forEach((record: any) => {
          const node = handleNativeData(nodes, record);
        });
        dispatch({
          type: GET_SEARCH,
          data: nodes,
        });
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
//展开节点
export const AppendNode = (nodeId: string) => async (dispatch: Function) => {
  try {
    const response = await axiosInstance.get("/append", {
      params: { nodeId: nodeId },
    });
    if (response.status === 200) {
      const data = response.data;
      const nodes: any[] = [];
      const edges: any[] = [];
      console.log("get data");
      data.forEach((record: { r: any; n: any }) => {
        // 提取节点
        const node = handleNativeData(nodes, record.n);
        //提取边id
        const edgeid = handleElementId(record.r);
        const existingEdgeIndex = edges.findIndex(
          (existingEdge) => existingEdge.id === edgeid
        );
        if (existingEdgeIndex === -1) {
          edges.push({
            id: edgeid,
            source: nodeId, // 假设节点有一个属性为 id
            target: node.id,
            label: record.r.type,
          });
        }
      });
      console.log("dispatch start");
      dispatch({
        type: GET_APPENDNODE,
        data: {
          nodes: nodes,
          edges: edges,
        },
      });
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
//服务网点
export const getCitys = () => async (dispatch: Function) => {
  try {
    const response = await axiosInstance.get("/citys");
    if (response.status === 200) {
      const data = response.data;
      const cityData: any[] = [];
      data.forEach((record: any) => {
        const node = handleNativeData(cityData, record.n);
      });

      let randomCount = cityData.length;
      if (randomCount > 0) {
        let addrData: any[] = [];
        while (randomCount--) {
          let cityName = cityData[randomCount];
          if (cityName !== undefined) {
            const address = cityName.地址;
            //创建地址解析器实例
            const myGeo = new BMapGL.Geocoder();
            let cityCenter: any = {};
            myGeo.getPoint(
              address,
              function (point) {
                if (point) {
                  cityCenter.geometry = {
                    type: "Point",
                    coordinates: [point.lng, point.lat],
                  };
                  cityCenter.properties = cityName;
                  addrData.push(cityCenter);
                } else {
                  console.log("您选择的地址没有解析到结果！", address);
                }
              },
              ""
            );
          }
        }
        dispatch({
          type: GET_CITYS,
          data: addrData,
        });
      }
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
//搜索设置
//专利
export const getAssignee =
  () => async (dispatch: Function) => {
    try {
      const response = await axiosInstance.get("/assigneeName");
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
export const updateGraphData = (data: any) => {
  return {
    type: GET_GRAPHDATA,
    data: data,
  };
};
export const setMapModel = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_MAPMODEL,
    data: data,
  });
};
export const getLength = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_LENGTH,
    data: data,
  });
};
export const setRelationships = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_RELA,
    data: data,
  });
};
export const setSelectedNode = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_SELECTNODE,
    data: data,
  });
};
export const setSelectInfo = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_SELECTINFO,
    data: data,
  });
};
export const clearSearchNodes = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_SEARCH,
    data: data,
  });
};
export const setLoading = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_LOADING,
    data: data,
  });
};
