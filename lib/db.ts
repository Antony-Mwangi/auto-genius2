import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend globalThis safely in TypeScript for Next.js hot-reloading
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Ensure the cache persists across hot-reloads in development
let cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV !== "production") {
  globalThis.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // 1. If a connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If no connection promise exists, initialize it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "autogenius",
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // 3. Await the promise and cache the resolved connection
  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB (Autogenius)");
  } catch (error) {
    // Reset the promise on failure so subsequent requests can try again
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
}