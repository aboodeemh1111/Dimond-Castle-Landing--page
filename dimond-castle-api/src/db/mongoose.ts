import mongoose from "mongoose";
import { config } from "../config/env";

mongoose.set("strictQuery", true);

export async function connectToDatabase(): Promise<typeof mongoose> {
  return mongoose.connect(config.mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });
}
