export const GET_NODE = "GET_NODE";
export const GET_EDGE = "GET_EDGE";
// export async function executeNeo4jQueryNode(driver, session) {
//   try {
//     const result = await session.run("MATCH (n) OPTIONAL MATCH (n)-[r]-() RETURN n, r LIMIT 100"); // 替换为实际的 Cypher 查询
//     const nodes = result.records.map((record) => record._fields[0].properties);
//     const edges = result.records.map((record) => record._fields[1]);
//     const records = {
//       nodes,
//       edges
//     }
//     return records;
//   } finally {
//     // 确保在查询结束后关闭 session
//     await session.close();
//   }
// }
