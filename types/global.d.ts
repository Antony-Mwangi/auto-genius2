import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Matches the exact variable used in your connectDB utility
  var mongooseCache: MongooseCache | undefined;
}

export {};