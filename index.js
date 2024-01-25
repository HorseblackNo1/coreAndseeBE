// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());
const axios = require('axios')
const port = 9000


// // app.get('/*', (req, res) => {

// //   res.send('Hello World!')
// // })

// // app.post('/*', (req, res) => {
// //   res.send('Hello World!')
// // })


// // app.all('*', function(req, res, next) {
// //   // res.setHeader('Access-Control-Allow-Origin','*');
// //   // res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); 
// //   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
// //   res.setHeader('content-disposition', 'inline'); 


// //   // res.setHeader("Content-Type", "application/json;charset=utf-8");
// //   next();
// // })

// app.get('/',(req,res)=>{
//   res.send('主页面')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

let http = require("http");

// Server
http
  .createServer(function (req, res) {
    router(req, res);
  })
  .on("error", function (e) {
    console.log(e);
  })
  .listen(port, "0.0.0.0");
let ts = new Date().toLocaleString({ timeZone: "Asia/Shanghai" });
console.debug(ts + `: server start... http://0.0.0.0:${port}`);

// Router
function router(req, res) {
  switch (req.url) {
    case "/":
      index(req, res); break;
    case "/cors":
      index(req, res); break;
    case "/cors/":
      index(req, res); break;
    case "/cors/simple_request":
      simple_request(req, res); break;
    case "/cors/preflight":
      preflight(req, res); break;
    case "/cors/credential":
      credential(req, res); break;
    case "/cors/credential_wrong":
      credential_wrong(req, res); break;
    case "/event/eventStream":
      eventStream(req, res); break;

    case "/createBlockEntity":
      createBlockEntityFn(req, res); break;
    default:
      // no action;
      res.end("...");
  }
}

// Biz logic
function index(req, res) {
  res.end('{"code":200,"msg":"test for cors ..."}');
}
function simple_request(req, res) {
  res.end('{"code":200,"msg":"test for cors (Simple requests) ..."}');
}
function preflight(req, res) {
  if (req.method == "OPTIONS") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 204;
    res.end("");
  } else {
    res.setHeader("Set-Cookie", "key_from_server_preflight=value_from_server1;");
    res.setHeader("Content-Type", "application/json");
    // res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        code: 200,
        msg: "test for cors (Requests with preflight) ...",
        orgin: req.headers["origin"] ?? "null",
        cookie: req.headers["cookie"] ?? "null",
      })
    );
  }
}
function credential(req, res) {
  if (req.method == "OPTIONS") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", req.headers["origin"] ?? "null");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 204;
    res.end("");
  } else {
    res.setHeader("Set-Cookie", "key_from_server_credential=value_from_server2;");
    res.setHeader("Content-Type", "application/json");
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Origin", (req.headers["origin"] ?? "null"));
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        code: 200,
        msg: "test for cors (Requests with credentials) ...",
        orgin: req.headers["origin"] ?? "null",
        cookie: req.headers["cookie"] ?? "null",
      })
    );
  }
}
function credential_wrong(req, res) {
  if (req.method == "OPTIONS") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 204;
    res.end("");
  } else {
    res.setHeader("Set-Cookie", "key_from_server_credential=value_from_server2;");
    res.setHeader("Content-Type", "application/json");
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        code: 200,
        msg: "test for cors (Requests with credentials) ...",
        orgin: req.headers["origin"] ?? "null",
        cookie: req.headers["cookie"] ?? "null",
      })
    );
  }
}


function createBlockEntityFn(req, res) {
  if (req.method == "OPTIONS") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 204;
    res.end("");
  } else {

    axios('https://open.feishu.cn/open-apis/block/v2/entities', {
        headers: {
          "authorization": `Bearer t-g1041ne8Y7TMKCYHT5XAECX6YVT2QLVSPZNLCFWB`,
          "content-Type": 'application/json; charset=utf-8'
        },
        method:'POST',
        data:{
            "title": "测试title",
            "block_type_id": "blk_659bcd06e783000346b5971e",
            "source_data": {"data":"业务数据"},
            "version": "1",
        }

      })
      .then(response => {
        console.log(`状态码: ${response.statusCode}`)
        console.log(response)

        res.setHeader("Set-Cookie", "key_from_server_preflight=value_from_server1;");
        res.setHeader("Content-Type", "application/json");
        // res.setHeader('Access-Control-Allow-Credentials', 'false');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            code: 200,
            msg: response,
          })
        );
      })
      .catch(error => {
        res.end(
          JSON.stringify(error.response.data)
        )
       
        console.log("错误信息=>",error.response.data)
      })



  }
}

async function eventStream(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Type", "text/event-stream");
  res.flushHeaders();

  let count = 0;
  res.write(`data: ${JSON.stringify({ msg: 'start' })}\n\n`);
  const intervalId = setInterval(() => {
    count += 1
    res.write(`data: ${JSON.stringify({ msg: count })}\n\n`);

    if (count > 5) {
      res.write(`data: ${JSON.stringify({ msg: 'end' })}\n\n`);
      res.write(`data: [DONE]}\n\n`);
      clearInterval(intervalId);
    }
  }, 1000);


}

