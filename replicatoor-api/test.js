var WebSocket = require("ws");
var ws = new WebSocket("wss://3mhz.modulenft.xyz/");
// var ws = new WebSocket("ws://localhost:3000/ws");

let API_KEY = "931028357360009287";

ws.on("open", function open() {
  ws.send(
    JSON.stringify({
      type: "auth",
      apiKey: API_KEY,
    })
  );
});

ws.on("message", function (data) {
  // if (
  // JSON.parse(data).contractAddress ==
  // "0xe373db56b558a7d9dd6090124f0857c8d622a427"
  // ) {
  // console.log(JSON.parse(data));
  // }

  // if (JSON.parse(data).source === "looksrare") {
  //   console.log(JSON.parse(data));
  // }

  console.log(JSON.parse(data).source);
});
