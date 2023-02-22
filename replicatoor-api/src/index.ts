import uws from "uWebSockets.js";
import "./redissub";
import keccak256 from "keccak256";
// import { insertListing } from "./db";
import { apiKeys } from "./apiKeys";
import { addToListingQueue } from "./insertListing";

let store = [];
let queue = [];

const register = {};

setInterval(() => {
  store = [];
}, 900000);

class Publisher {
  private app: any;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.app = uws.App();

    this.app.ws("/*", {
      // /* Options */ compression: uws.SHARED_COMPRESSOR,
      // maxPayloadLength: 16 * 1024 * 1024,
      // idleTimeout: 10,
      /* Handlers */
      open: (_ws) => this.open(_ws),
      message: (message, _ws) => this.message(message, _ws),
      drain: () => this.drain(),
      close: (code, message) => this.close(code, message),
    });
  }

  public start() {
    this.app
      .get("/listings", (res, _req) => {
        res.writeHeader("Content-Type", "text/plain");
        res.end("Hello World!");
      })
      .listen(this.port, (token: any) => {
        if (token) {
          console.log("Listening to port " + this.port);
        } else {
          console.log("Failed to listen to port " + this.port);
        }
      });

    setInterval(() => {
      for (const key in register) {
        try {
          // if not authenticated, end connection
          if (!register[key].auth) {
            register[key].ws.end(1000, "unauthorized");
            delete register[key];
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 30000);
  }

  public open(_ws) {
    console.log("WebSocket connected", _ws);
    // subscribe to the channel
    // check apiKey query param
    // if valid, subscribe to the channel
    // if not valid, close the connection

    // generate a unique id for the client
    _ws.id = Math.random().toString(36).substring(7);
    register[_ws.id] = {
      ws: _ws,
      auth: false,
    };
    // _ws.subscribe('listings');
  }

  public publish(message: string) {
    try {
      console.log("Publishing message");
      const hash = keccak256(message).toString("hex");
      if (!store.includes(hash)) {
        const listing = JSON.parse(message);
        if (listing.source === "opensea") {
          const isPrivate = checkIfListingIsPrivate(listing);
          if (isPrivate) {
            store.push(hash);
            // addToListingQueue(JSON.parse(message));
            return;
          }
        }
        // console.log(listing.source);
        // const timeNow = new Date().getTime();
        // const time = new Date(listing.createdAt).getTime();
        // const timeDiff = timeNow - time;
        // if time diff is more then 30 seconds, dont publish
        // console.log(timeDiff);
        // if (timeDiff > 300000) {
        //   // console.log("Time diff is more than 30 seconds", listing.source);
        //   store.push(hash);
        //   addToListingQueue(JSON.parse(message));
        //   return;
        // }

        if (listing.source === "blur") {
          // if time > 1 hour, dont publish
          const timeNow = new Date().getTime();
          const time = new Date(listing.createdAt).getTime();
          const timeDiff = timeNow - time;
          if (timeDiff > 3600000) {
            // console.log("Time diff is more than 30 seconds", listing.source);
            store.push(hash);
            addToListingQueue(JSON.parse(message));
            return;
          }
        }

        this.app.publish("listings", message);
        store.push(hash);
        addToListingQueue(JSON.parse(message));
      }
    } catch (e) {
      console.log(e, message);
    }

    // send message to all clients
  }

  public queue(message: string) {
    if (!queue.includes(message)) {
      queue.push(message);
    }
  }

  public close(_closeCode, _closeMessage) {
    console.log("WebSocket closed");
  }

  public message(_ws, message) {
    // console.log('Message received');
    // console.log(_ws.id, message);

    // convert message buffer to string
    const buffer = Buffer.from(message);
    const string = buffer.toString();

    const data = JSON.parse(string);
    console.log(data);

    if (data.type === "auth") {
      if (apiKeys.includes(data.apiKey)) {
        console.log("Authenticated");
        register[_ws.id].auth = true;
        _ws.subscribe("listings");
      }
    }
  }

  public drain() {
    this.app.drain();
    console.log("WebSocket backpressure: " + this.app.getBufferedAmount());
  }
}

const checkIfListingIsPrivate = (listing) => {
  const offerItem = listing.orderData.parameters.offer;

  for (let i = 0; i < offerItem.length; i++) {
    const item = offerItem[i];
    const itemFound = listing.orderData.parameters.consideration.find(
      (consideration) =>
        consideration.token === item.token &&
        consideration.identifierOrCriteria === item.identifierOrCriteria
    );
    if (itemFound) {
      console.log("Private listing found");
      return true;
    }
  }

  return false;
};

const publisher = new Publisher(4123);
publisher.start();

setInterval(() => {
  if (queue.length > 0) {
    for (const message of queue) {
      publisher.publish(message);
      queue = queue.filter((item) => item !== message);
    }
    queue = [];
  }
}, 5);

process.on("uncaughtException", (err) => {
  console.log(err);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});

export default publisher;
