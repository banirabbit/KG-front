### 1.查询特定个数的三元组，方便调试
参数：relationships
返回：{nodes:[...], edges:[...]}
```
"MATCH (m)-[r]-(n) RETURN m, r, n LIMIT " + relationships
```
实现这个功能还需要知道关系总数
```
MATCH ()-[r]->() RETURN COUNT(r)
```

### 2.根据id删除节点
参数：id
```
MATCH (n) WHERE ID(n) = {node_id} DELETE n
```
### 3.修改节点
参数：id，newProperty(其中name,class(类别)不能为空，其他任意)
```
newProperty{
    name:"",
    class:"",
    ...
}
```
```
MATCH (n) WHERE ID(n) = id SET n = newProperty RETURN n
```
### 4.增加一个节点
参数：Label(类别)，property(其中name不能为空,其他任意)
```
property{
    name:"",
    ...
}
```
```
CREATE (n:Label {property})
```
### 5.增加一个关系
参数：id1,id2,relaType(关系名称)
```
MATCH (n1), (n2) WHERE ID(n1) = id1 AND ID(n2) = id2 CREATE (n1)-[:relaType]->(n2)
```
### 6.模糊搜索节点，最好可以调整一下结果个数
参数：searchNumber(为空时默认25),searchItem, itemClass(节点类型)
返回:nodes[]
```
"MATCH (n) WHERE n.name CONTAINS searchItem AND n.label = itemClass RETURN n LIMIT searchNumber"
```
### 7.搜索边
参数：relaType,relaNumber
返回：{nodes:[], edges:[]}
```
MATCH (m)-[r:`relaType`]->(n) RETURN m,r,n LIMIT relaNumber
```
### 8.获取某个节点所有的邻接节点，如果用户想要屏幕上只出现搜索结果的话，可以通过展开继续查看其他节点
参数:nodeId
返回:{nodes:[...], edges:[...]}
```
"MATCH (a)-[r]-(n) WHERE id(a) =" + nodeId + " RETURN r, n"
```
### 9.返回节点总数，做数据统计
返回：nodeCount
```
"MATCH (n) RETURN COUNT(n) AS nodeCount"
```
### 10.查询带地址的数据，用来做地图布局，限制一下结果数量因为百度地图api有个数限制
返回：nodes[...]
```
MATCH (n) WHERE any(key in keys(n) WHERE key CONTAINS '地址') RETURN n LIMIT 100
```
