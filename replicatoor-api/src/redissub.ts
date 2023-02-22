import redis from "ioredis";
import publisher from ".";
// import publisher from ".";
// export const Redis = new redis({
//   port: 6379, // Redis port
//   host: "redis-0.redis.redis.svc.cluster.local", // Redis host
//   // host: "127.0.0.1",
//   family: 4, // 4 (IPv4) or 6 (IPv6)
//   password: "6Uk)VM-%mzqTh()^",
//   db: 0,
// });

const Redis = new redis(
  "rediss://default:AVNS_qhMVZAsDXxxDPDvQxa3@db-redis-tor1-91715-do-user-8592364-0.b.db.ondigitalocean.com:25061"
);

// subscribe to the channel
Redis.subscribe("listings", (_err, _listing) => {
  console.log("subscribed to listings");
  // publisher.publish(_listing as any);
});

Redis.on("message", (_channel, _message) => {
  console.log("message received");
  publisher.queue(_message);
});

// setInterval(() => {
//   console.log("publishing");
//   Redis2.publish("listings", "Hello World!");
// }, 1000);
