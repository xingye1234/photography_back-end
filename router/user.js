const express = require("express");

const router = express.Router();
const queryData = require("../dataBase.js");
// const formidable = require("formidable");
fs = require("fs");

const multer = require("multer");

//获取全部用户

router.get('/', (req, res)=> {
  queryData(`select * from user`, (err, result)=>{
    if(result.length > 0){
      res.send({
        code:200,
        data:result
      })
    }
  })
})

//用户登录
router.post("/login", (req, res) => {
  //取出前端传送的数据
  const { name, password } = req.body;
  // console.log(name, password);
  queryData(
    `select * from user where username = '${name}' and password = '${password}'`,
    (err, result) => {
      // console.log(result, err);
      if (result.length !== 0) {
        res.send({
          result,
          code: 200,
        });
      } else {
        res.send({
          code: 201,
          msg: "该账号不存在!",
        });
      }
    }
  );
});

//用户注册
router.post("/register", (req, res) => {
  //取出前端传送的数据
  const name = req.body.name;
  const password = req.body.password;
  queryData(
    `select * from user where username = '${name}' and password = '${password}'`,
    (err, result) => {
      if (result.length !== 0) {
        res.send({
          msg: "该名称已注册！",
          code: 201,
        });
      } else {
        //取出前端传送的数据

        const { username, password, address, email, phone } = req.body;
        queryData(
          `INSERT INTO user(username,password,address,phone, email) VALUES(?,?,?,?,?)`,
          (err, result) => {
            // console.log(err);
            if (result.affectedRows > 0) {
              res.send({
                code: 200,
                msg: "注册成功！",
              });
            }
          },
          [username, password, address, email, phone]
        );
      }
    }
  );
});

//请求用户信息
router.get("/userInfo/:id", (req, res) => {
  const id = req.params.id;
  queryData(`select * from user where user_id=${id}`, (err, result) => {
    if (result.length !== 0) {
      res.send({
        result,
        code: 200,
      });
    }
  });
});

//用户填写资料
router.post("/editInfo", (req, res) => {
  //取出前端传送的数据
  const {
    user_id,
    name,
    nickName,
    sex,
    address1,
    address2,
    desc,
    birthday,
    phone,
    mail,
    chat,
    qq,
  } = req.body;

  let address = address1 + address2;

  //更新用户信息
  queryData(
    "UPDATE user SET nick_name = ?,sex = ?, address = ?, description = ?, birthday = ?, phone = ?, email = ?, chat = ?, QQ = ? WHERE user_id = ?",
    (err, result) => {
      // console.log(err, result);
      if (result.affectedRows > 0) {
        res.send({
          code: 200,
          msg: "修改成功！",
        });
      }
    },
    [nickName, sex, address, desc, birthday, phone, mail, chat, qq, user_id]
  );
});

//用户上传头像
const upload = multer({ dest: __dirname + "/public/avatar" });
router.post("/avatar", upload.single("file"), (req, res) => {
  const file = req.file;
  // console.log(file);
  const { id } = req.body;
  // console.log(id);
  // console.log(file);
  const { mimetype, filename } = file;
  let tmpType = mimetype.split("/")[1];
  date = Date.now().toString();
  let fullFileName = `${date}${filename}.${tmpType}`; // 拼接图片名称：+图片名称
  let filepath = file.path;

  //拼接字符串
  let imgUrl = `http://localhost:9527/avatar/${fullFileName}`;
  queryData(
    `UPDATE user SET avatar = ? WHERE user_id = ?`,
    (err, result) => {
      // console.log(err, result);
      if (result.affectedRows > 0) {
        //将文件读入public/images文件夹
        fs.writeFileSync(
          `public/avatar/${fullFileName}`,
          fs.readFileSync(filepath)
        );

        //更新article文章表中用户头像
        queryData(
          `update article set avatar = ? where user_id = ?`,
          (err, result) => {},
          [imgUrl, id]
        );

        res.send({
          code: 200,
          msg: "上传成功",
          img: imgUrl,
        });
      }
    },
    [imgUrl, id]
  );
});

//获取用户头像
router.get("/getAvatar/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  queryData(`select * from user where user_id = ${id}`, (err, result) => {
    // console.log(err, result);
    if (result.length > 0) {
      res.send({
        code: 200,
        imgUrl: result[0].avatar,
      });
    }
  });
});

//获取用户作品
router.get("/production/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(id);
  queryData(`select * from article where user_id = ${id}`, (err, result) => {
    // console.log(err, result);
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result,
      });
    }
  });
});

module.exports = {
  router,
};
