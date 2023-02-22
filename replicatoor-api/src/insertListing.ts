// import Client from "./atlas";

import pgpP from "pg-promise";
export const pgp = pgpP();

export const client = pgp({
  user: "apiv2writepool",
  password: "AVNS_ZlZLnVSI0CBIX_b6YLe",
  host: "module-v2-do-user-8592364-0.b.db.ondigitalocean.com",
  port: 25061,
  database: "apiv2writepool",
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
});

const insertQueue = [];
const max_queue_size = 200;

const cs = new pgp.helpers.ColumnSet(
  [
    "id",
    "tokenId",
    "contractAddress",
    "collection",
    "tokenName",
    "source",
    "currency",
    "price",
    "orderQuantity",
    "seller",
    "createdAt",
    "endAt",
    "orderData",
    "active",
  ],
  { table: "nft_listings_v2" }
);

export const addToListingQueue = async (listing) => {
  if (
    listing.contractAddress.toLowerCase() ===
    "0x495f947276749ce646f68ac8c248420045cb7b5e"
  ) {
    return;
  }
  const id = `${listing.contractAddress}-${listing.tokenId}-${listing.source}-${listing.createdAt}-${listing.endAt}`;
  listing.id = id;
  listing.active = true;
  const requiredFields = [
    "id",
    "tokenId",
    "contractAddress",
    "collection",
    "tokenName",
    "source",
    "currency",
    "price",
    "orderQuantity",
    "seller",
    "createdAt",
    "endAt",
    "orderData",
    "active",
  ];
  const missingFields = requiredFields.filter((field) => !(field in listing));
  missingFields.forEach((field) => {
    listing[field] = null;
  });

  insertQueue.push(listing);

  if (insertQueue.length >= max_queue_size) {
    try {
      await flushQueue();
    } catch (e) {
      console.log(e);
    }
  }
};

const flushQueue = async () => {
  console.log("flushing queue");
  const query = pgp.helpers.insert(insertQueue, cs) + " ON CONFLICT DO NOTHING";
  insertQueue.length = 0;
  console.log(query);
  await client.none(query);
};
