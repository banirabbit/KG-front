const {load, extract, cut} = require('@node-rs/jieba')
const db = require('../db/index')
load();
const sql = "SELECT content FROM user_input"
let searchList = "";
const topN = 4;
db.query(sql,function(err, results) {
    if(err) {
        return console.log("query err")
    }
    // 遍历查询结果，将 content 字段值存储到 searchList 数组中
    results.forEach(element => {
        searchList = searchList + element.content + ",";
    });
    console.log(extract(
        searchList,
        8,
      ));
    console.log(extract('2023-01-1, 2023-01-2, 2023-01-10, 2023-02-09', 3, ))
})

