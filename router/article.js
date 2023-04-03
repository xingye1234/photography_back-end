const express = require("express");
const app = express();
const router = express.Router();
const queryData = require("../dataBase");
fs = require("fs");
const multer = require("multer");

//暴露静态资源
app.use("/public", express.static("public"));

let date;
let fullFileName;
let filepath;

const addImg = (fullFileName, filepath) => {
  fs.writeFileSync(`public/images/${fullFileName}`, fs.readFileSync(filepath));
};

//获取所有优秀作品内容
router.get("/", (req, res) => {
  queryData(`select * from article`, (err, result) => {
    // console.log(result);
    if (!err) {
      res.send({
        msg: "success",
        code: 200,
        data: result,
      });
    }
  });
});

//上传照片
const upload = multer({ dest: __dirname + "/public/avatar" });
router.post("/upload", upload.single("file"), (req, res, next) => {
  const file = req.file;

  const { mimetype, filename } = file;
  let tmpType = mimetype.split("/")[1];
  date = Date.now().toString();
  fullFileName = `${date}${filename}.${tmpType}`; // 拼接图片名称：+图片名称
  filepath = file.path;
  //将文件读入public/images文件夹
  fs.writeFileSync(`public/images/${fullFileName}`, fs.readFileSync(filepath));
  res.send({});
});

//用户发表内容
router.post("/pubcontent", (req, res, next) => {
  const { user_id, title, desc, username, avatar, address } = req.body;
  const good = 0;
  // console.log(username);
  //拼接图片路径
  let imgUrl = `http://localhost:9527/images/${fullFileName}`;

  queryData(
    `INSERT INTO article(user_id,title,description,username,avatar,address,img, good) VALUES(?,?,?,?,?,?,?,?)`,
    (err, result) => {
      queryData(
        `UPDATE user SET avatar = ? WHERE user_id = ?`,
        (err, result) => {},
        [avatar, user_id]
      );
      // console.log(err, result);
      if (!err) {
        addImg(fullFileName, filepath);
        res.send({
          code: 200,
          msg: "发布成功",
          imgUrl: fullFileName,
        });
      }
    },
    [user_id, title, desc, username, avatar, address, imgUrl, good]
  );
});

//管理员删除文章
router.post("/remove", (req, res) => {
  const id = req.body.id;
  console.log(id);
  queryData(`DELETE FROM article where article_id=${id}`, (err, result) => {
    // console.log(err, result);
    if (result.affectedRows > 0) {
      res.send({
        code: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        code: 201,
        msg: "删除失败",
      });
    }
  });
});

module.exports = {
  router,
};
