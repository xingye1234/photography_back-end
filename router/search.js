const express = require("express");
const queryData = require("../dataBase");
const router = express.Router();

//用户查询搜索内容
router.get("/searchValue/:value", (req, res) => {
  const value = req.params.value;

  queryData(
    `select * from article where title like '%${value}%'`,
    (err, result) => {
      //   console.log(result, err);
      if (result.length > 0) {
        res.send({
          code: 200,
          data: result,
        });
      }
    }
  );
});

//获取全部举报
router.get("/report", (req, res) => {
  queryData(`select * from report`, (err, result) => {
    // console.log(err, result);
    if (!err) {
      res.send({
        code: 200,
        data: result,
      });
    }
  });
});

//删除举报信息
router.post("/removeReport", (req, res) => {
  const id = req.body.id;
  console.log(id);
  queryData(`delete from report where report_id = ${id}`, (err, result) => {
    // console.log(err, result);
    if (!err) {
      return res.send({
        code: 200,
        msg: "删除成功",
      });
    }
  });
});

//查询文章或id
router.get("/searchArticle/:value", (req, res) => {
  const value = req.params.value;
  if (Number(value)) {
    queryData(
      `select * from article where article_id = ${value}`,
      (err, result) => {
        // console.log(err, result);
        if (result.length > 0) {
          res.send({
            code: 200,
            data: result,
          });
        } else {
          res.send({
            code: 201,
            msg: "查询无结果",
          });
        }
      }
    );
  } else {
    queryData(
      `select * from article where title like '%${value}%'`,
      (err, result) => {
        // console.log(err, result);
        if (result.length > 0) {
          res.send({
            code: 200,
            data: result,
          });
        } else {
          res.send({
            code: 201,
            msg: "查询无结果",
          });
        }
      }
    );
  }
});

//查询用户
router.get("/searchUser/:value", (req, res) => {
  const value = req.params.value;
  // console.log(value);
  queryData(`select * from user where username='${value}'`, (err, result) => {
    // console.log(err, result);
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result,
      });
    } else {
      res.send({
        code: 201,
        msg: "查无结果",
      });
    }
  });
});
module.exports = {
  router,
};
