const express = require("express");
const path = require("path");
const neo4j = require("neo4j-driver");
const cors = require("cors");

const app = express();
const db = require("./db/index");
app.use(cors()); // 允许跨域请求

const PORT = process.env.PORT || 5000;

// Neo4j数据库连接
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "12345678")
);
const session = driver.session();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));
//处理错误的中间件
app.use(function (req, res, next) {
  res.cc = function (err, status = 1) {
      res.send({
          status,
          message: err instanceof Error ? err.message : err,
      })
  }
  next()
})
app.use(function(err, req, res, next) {
  res.cc(err)
})
// Neo4j查询测试
app.get("/getNodes", async (req, res) => {
  try {
    const result = await session.run(
      "MATCH (m)-[r]-(n) RETURN m, r, n LIMIT 50;"
    );
    const data = result.records.map((record) => record.toObject());
    res.setHeader("Content-Type", "application/json");
    res.json(data);
  } catch (error) {
    console.error("Error executing Neo4j query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/search", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const sql = "insert into user_input set ?";

  try {
    // 将回调函数包装成返回 Promise 的异步函数
    const dbQueryAsync = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };
    // 先进行数据库查询
    const results = await dbQueryAsync(sql, { content: searchTerm });
    if (results.affectedRows !== 1) {
      return res.cc("加入数据库失败");
    }

    // 数据库操作成功，继续下面的 Neo4j 查询
    const neo4jResult = await session.run(
      "MATCH (n) WHERE n.name CONTAINS $searchTerm RETURN n LIMIT 10",
      { searchTerm }
    );

    const records = neo4jResult.records.map((record) => record.get("n"));

    // 发送成功响应
    res.json(records);
  } catch (error) {
    console.error("Error in /search route:", error);
    // 发送其他错误响应
    res.cc(error);
  }
});
app.get("/append", async (req, res) => {
  const nodeId = req.query.nodeId;
  const cypher =
    "MATCH (a)-[r]-(n) WHERE id(a) =" + nodeId + " RETURN r, n LIMIT 100";
  const result = await session.run(cypher, { nodeId });

  const records = result.records.map((record) => record.toObject());
  res.json(records);
});
app.get("/citys", async (req, res) => {
  const cypher =
  "MATCH (n:`服务网点`) RETURN n LIMIT 200";
  const result = await session.run(cypher);

  const records = result.records.map((record) => record.toObject());
  res.json(records);
});
app.get("/maxNodeNumber", async (req, res) => {
  const cypher =
  "MATCH (n) RETURN COUNT(n) AS nodeCount";
  const result = await session.run(cypher);
  res.json(result.records[0].get("nodeCount"));
})
app.get("/assigneeName", async (req, res) => {
  const cypher =
  "MATCH (m:`专利`) RETURN m.assignee LIMIT 100";
  const result = await session.run(cypher);
  res.json(result);
})
// 关闭Neo4j会话和驱动程序
app.on("close", () => {
  session.close();
  driver.close();
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// 在 Express 应用程序关闭时关闭驱动程序
server.on("close", () => {
  // 关闭 Neo4j 会话和驱动程序
  session.close();
  driver.close();
});