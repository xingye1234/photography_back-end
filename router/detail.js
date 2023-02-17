const express = require("express");
const router = express.Router();
const queryData = require("../dataBase");

//获取当前文章详情
router.get("/itemDetail/:id", (req, res) => {
  const id = req.params.id;
  queryData(`SELECT * FROM article WHERE article_id=${id}`, (err, result) => {
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result,
      });
    }
  });
});

//获取当前用户信息
router.get("/userInfo/:id", (req, res) => {
  const { id } = req.params;
  queryData(`SELECT * FROM user WHERE user_id=${id}`, (err, result) => {
    // console.log(result);
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result,
      });
    }
  });
});

//用户点赞
router.get("/userLike/:id", (req, res) => {
  const { id } = req.params;
  queryData(
    `UPDATE article SET good = good+1 WHERE article_id = ?`,
    (err, result) => {
      // console.log(err, result);
      if (result.affectedRows > 0) {
        res.send({
          code: 200,
          msg: "点赞成功",
        });
      }
    },
    [id]
  );
});

//发表文章评论
router.post("/pluscomment", (req, res) => {
  const { article_id, user_id, content, avatar, username } = req.body;
  // console.log(article_id, user_id, content);
  queryData(
    `INSERT INTO comment(article_id,user_id,content, avatar, username) VALUES(?,?,?,?,?)`,
    (err, result) => {
      // console.log(err, result);
      if (result.affectedRows > 0) {
        res.send({
          code: 200,
          msg: "评论成功",
        });
      }
    },
    [article_id, user_id, content, avatar, username]
  );
});

//获取文章评论
router.get("/comments/:id", (req, res) => {
  const article_id = req.params.id;

  queryData(
    `select * from comment where article_id = ${article_id}`,
    (err, result) => {
      // console.log(err, result);
      if (result.length > 0) {
        res.send({
          code: 200,
          data: result,
        });
      } else {
        res.send({});
      }
    }
  );
});

//关注用户
router.post("/follow", (req, res) => {
  const { to, from, username, avatar } = req.body;
  // console.log(to, from, username, avatar);
  queryData(
    `insert into user_follow(from_id,to_id,username,avatar) values(?,?,?,?)`,
    (err, result) => {
      // console.log(err, result);
      if (result.affectedRows > 0) {
        queryData(`update user set followee_count = followee_count+1 WHERE user_id = ?`, ()=>{}, [from])
        queryData(`update user set follower_count = follower_count+1 WHERE user_id = ?`, ()=>{}, [to])
        res.send({
          code: 200,
          isFollow: true,
          msg: "关注成功",
        });
      }
    },
    [from, to, username, avatar]
  );
});

//获取关注用户
router.get("/user_follow/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);

  queryData(`select * from user_follow where from_id=${id}`, (err, result) => {
    // console.log(err, result);
    // console.log(result);
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result,
      });
    }
  });
});

//获取用户作品
router.get("/userProduct/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  queryData(`select * from article where user_id=${id}`, (err, result) => {
    // console.log(result);
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result.length,
      });
    }
  });
});

//用户举报
router.post("/report", (req, res) => {
  const { reportable_id, user_id, type, description } = req.body;
  // console.log(reportable_id, user_id, type, description);

  queryData(`insert into report(reportable_id, reportable_type, user_id, reason) values(?,?,?,?)`, (err, result)=>{
    console.log(err,result);
    if(result.affectedRows > 0){
      res.send({
        code:200,
        msg:'举报成功，我们将会尽快受理！'
      })
    }
  }, [reportable_id, type, user_id, description])
});

module.exports = {
  router,
};
