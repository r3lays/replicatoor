const WebSocket = require("ws");
const ws = new WebSocket("wss://3mhz.modulenft.xyz/");
// const ws = new WebSocket("http://localhost:4123");

const API_KEY = "06718b93-8e6c-449b-bf82-0a7fe46ac558";

let openSeaListings = 0,
  openSeaDelays = [],
  x2Listings = 0,
  x2Delays = [];

ws.on("open", function open() {
  console.log("Socket connected", new Date());
  ws.send(
    JSON.stringify({
      type: "auth",
      apiKey: API_KEY,
    })
  );
});

ws.on("message", (data) => {
  data = JSON.parse(data);
  if (data.source === "opensea") {
    if (openSeaListings < 50000) {
      const delay = new Date() - new Date(data.createdAt + "Z");
      openSeaListings++;
      console.log("OpenSea Listing #" + openSeaListings, "Delay:", delay);
      openSeaDelays.push(delay);
    }
  } else if (data.source === "x2y2") {
    if (x2Listings < 500) {
      const delay = new Date() - new Date(data.createdAt);
      x2Listings++;
      console.log("X2 Listing #" + x2Listings, "Delay:", delay);
      x2Delays.push(delay);
    }
  } else if (data.source === "blur") {
    const delay = new Date() - new Date(data.createdAt);
    console.log("Blur Listing", "Delay:", delay);
  } else if (data.source === "looksrare") {
    const delay = new Date() - new Date(data.createdAt);
    console.log("LooksRare Listing", "Delay:", delay);
  }

  if (openSeaListings === 10000) {
    ws.close();
    console.log("\n=============\n");
    console.log("OpenSea Listings:", openSeaListings);
    console.log("Min OpenSea Delay:", Math.min(...openSeaDelays));
    console.log("Max OpenSea Delay:", Math.max(...openSeaDelays));
    console.log(
      "Average OpenSea Delay:",
      openSeaDelays.reduce((a, b) => a + b) / openSeaDelays.length
    );
    console.log("\n=============\n");
    console.log("X2 Listings:", x2Listings);
    console.log("Min X2 Delay:", Math.min(...x2Delays));
    console.log("Max X2 Delay:", Math.max(...x2Delays));
    console.log(
      "Average X2 Delay:",
      x2Delays.reduce((a, b) => a + b) / x2Delays.length
    );
    openSeaListings++;
    x2Listings++;
  }
});

ws.on("error", (e) => {
  console.log(e);
});
ws.on("close", (e) => {
  console.log(e);
});
