const MONGODB_URI = process.env.MONGODB_URI!;
import mongoose from "mongoose";

const globalVar = globalThis as unknown as {
  mongoose: {
    isConnected: boolean;
  };
};
if (!globalVar.mongoose) {
  globalVar.mongoose = { isConnected: false };
}
const connect = async () => {
  if (globalVar.mongoose.isConnected) {
    return;
  }
  const db = await mongoose.connect(MONGODB_URI, {
    maxPoolSize: 30,
    minPoolSize: 1,
    autoIndex: false,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    maxIdleTimeMS: 10000,
  });
  globalVar.mongoose.isConnected = db.connection.readyState === 1;
};

const Database = {
  connect: connect,
};
export default Database;