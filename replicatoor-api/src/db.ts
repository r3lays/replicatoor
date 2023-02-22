import Client from "./atlas";
//
export interface ParsedListing {
  tokenId: string;
  contractAddress: string;
  collection: string;
  tokenName: string;
  source: "opensea" | "looksrare" | "x2y2";
  currency: string;
  price: string;
  orderQuantity: number;
  seller: string;
  createdAt: string;
  endAt?: string;
  orderData: any;
}

export const createTable = async () => {
  await Client.query(`CREATE TABLE IF NOT EXISTS nft_listings_v2 (
        id TEXT PRIMARY KEY,
        "tokenId" TEXT,
        "contractAddress" TEXT,
        "collection" TEXT,
        "tokenName" TEXT,
        "source" TEXT,
        "currency" TEXT,
        "price" TEXT,
        "orderQuantity" INTEGER,
        "seller" TEXT,
        "createdAt" TEXT,
        "endAt" TEXT,
        "orderData" JSONB,
        "active" BOOLEAN
    )`);
};

// createTable();

export const insertListing = async (listing: ParsedListing) => {
  const {
    tokenId,
    contractAddress,
    collection,
    tokenName,
    source,
    currency,
    price,
    orderQuantity,
    seller,
    createdAt,
    endAt,
    orderData,
  } = listing;
  const id = `${contractAddress}-${tokenId}-${source}-${createdAt}-${endAt}`;

  const result = await Client.query(
    `INSERT INTO nft_listings_v2 (id, "tokenId", "contractAddress", "collection", "tokenName", "source", "currency", "price", "orderQuantity", "seller", "createdAt", "endAt", "orderData", "active") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (id) DO NOTHING`,
    [
      id,
      tokenId,
      contractAddress,
      collection,
      tokenName,
      source,
      currency,
      price,
      orderQuantity,
      seller,
      createdAt,
      endAt,
      orderData,
      true,
    ]
  );
  console.log(result);
};
