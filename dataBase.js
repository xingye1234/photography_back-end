const mysql = require("mysql");

const queryData = (sql, callback, values) => {
  //创建连接
  const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "photography",
  });
  //连接数据库
  db.connect((err) => {
    // if (!err) {
    //   console.log("数据库连接成功!");
    // }
  });
  // 查询数据
  if (typeof values !== "object") {
    db.query(sql, callback);
  } else {
    db.query(sql, values, callback);
  }
  //关闭数据库
  db.end((err) => {
    // console.log("断开连接");
  });
};

module.exports = queryData;
