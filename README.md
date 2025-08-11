# 知识图谱可视化项目
## 前端启动
> npm install 下载依赖
npm run start启动项目

## 服务端启动
### 配置neoj4数据库
建立自己的neo4j数据库，然后修改server/index.js中的配置信息 
数据格式
节点：
{
    id:节点id,
    name:节点名称,
    label:节点类型,
    ...其他属性
}
关系：
{
    label:关系名称,
    ...其他属性
}
### 启动
> cd server
node index.js

# 使用说明
- 右键节点可展开/收起
- 点击“布局配置”可切换布局
- 在“操作”中，拖动滚动条，可显示不同数据
- “info”栏最下方可检索节点



