import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null
};

globalWithMongoose.mongooseCache = cache;

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI precisa estar configurada no .env.local");
  }

  if (cache.conn) {
    return cache.conn;
  }

  cache.promise ??= mongoose.connect(mongoUri, {
    dbName: "itrampo"
  });

  cache.conn = await cache.promise;
  return cache.conn;
}
