import mongoose from "mongoose";

function toObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  return new mongoose.Types.ObjectId(id);
}

export default toObjectId;