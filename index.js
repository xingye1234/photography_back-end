const express = require("express");
const app = express();
//取前端post传送内容，防止乱码插件
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

//设置允许跨域
app.use(cors());


const server = require("http").createServer(app); //生成服务器实例
const io = require("socket.io")(server, { cors: true });   //{ cors: true }配置解决跨域

io.on('connection', (socket) => {
  //接收前端发送的数据
  socket.on('message', (data) => {
    io.emit('messageResponse', data);
    // console.log(data);
  });

});

//设置在public下查找资源(以public为根去找静态资源)   读取图片关键代码
app.use(express.static(path.join(__dirname, "public")));

//配置前端传送的数据获取
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
//导入用户路由
const user = require("./router/user").router;
const article = require("./router/article").router;
const detail = require("./router/detail").router;
const search = require("./router/search").router;

// 安装路由     ,路由安装一定要安装在最下面！！！
app.use("/user", user);
app.use("/article", article);
app.use("/detail", detail);
app.use("/search", search);

server.listen(9527, () => {
  console.log("listening on port 9527");
});
