import { People } from "../components/Nodes/PeopleNode";
import { createNodeFromReact } from "@antv/g6-react-node";
import G6 from "@antv/g6";
export const GET_GRAPHDATA = "GET_GRAPHDATA";
interface GraphData {
  m: any;
  n: any;
  r: any;
}
export async function executeNeo4jQueryNode(
  driver: any,
  session: { run: (arg0: string) => any; close: () => any },
  dispatch: Function
) {
  try {
    const result = await session.run(
      "MATCH (m)-[r]-(n) RETURN m, r, n LIMIT 100;"
    ); // 替换为实际的 Cypher 查询
    const data = result.records.map((record: { toObject: () => any }) =>
      record.toObject()
    );
    console.log(data);
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

    G6.registerNode("People", createNodeFromReact(People));
    data.forEach((record: GraphData) => {
      // 提取节点
      //节点类型
      const group = record.n.labels[0];
      //提取节点id
      let inputString = record.n.elementId;
      let secondColonIndex = inputString.indexOf(
        ":",
        inputString.indexOf(":") + 1
      );
      let nodeid;
      if (secondColonIndex !== -1) {
        nodeid = inputString.substring(secondColonIndex + 1);
      } else {
        nodeid = record.n.properties.name;
      }
      const node = {
        ...record.n.properties,
        label: record.n.properties.name,
        group: group,
        id:nodeid,
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
        node.type = "People";
        nodes.push(node);
      }
      const relatedNode = record.m.properties;
      //提取节点id
      inputString = record.m.elementId;
      secondColonIndex = inputString.indexOf(
        ":",
        inputString.indexOf(":") + 1
      );
      if (secondColonIndex !== -1) {
        nodeid = inputString.substring(secondColonIndex + 1);
      } else {
        nodeid = record.m.properties.name;
      }
      relatedNode.id = nodeid;
      existingNodeIndex = nodes.findIndex(
        (existingNode) => existingNode.id === relatedNode.id
      );
      if (existingNodeIndex !== -1) {
        nodes[existingNodeIndex] = {
          ...nodes[existingNodeIndex],
        };
      } else {
        relatedNode.label = relatedNode.name;
        relatedNode.group = record.m.labels[0];
        relatedNode.type = "People";
        nodes.push(relatedNode);
      }
      //提取边id
      inputString = record.r.elementId;
      secondColonIndex = inputString.indexOf(
        ":",
        inputString.indexOf(":") + 1
      );
      let edgeid:any;
      if (secondColonIndex !== -1) {
        edgeid = inputString.substring(secondColonIndex + 1);
      } else {
        edgeid = record.n.properties.name;
      }
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
      } else {
        console.log(1111);
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
export const updateGraphData = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_GRAPHDATA,
    data: data,
  });
};
