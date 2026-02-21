import Database from "@/server/db/db-config";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface MeroShareAccountType extends Document {
  userID: Types.ObjectId;
  clientId: number;
  username: string;
  password: {
    content: string;
    iv: string;
    tag: string;
  };
  authorization: {
    content: string;
    iv: string;
    tag: string;
  };
}

export interface MeroShareAccountResponse {
  userID: string;
  clientId: number;
  username: string;
  password: {
    content: string;
    iv: string;
    tag: string;
  };
  authorization: {
    content: string;
    iv: string;
    tag: string;
  };
}

const encryptedField = {
  content: { type: String },
  iv: { type: String },
  tag: { type: String },
};

const meroSchema = new Schema<MeroShareAccountType>(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientId: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: encryptedField, required: true },
    authorization: { type: encryptedField, required: true },
  },
  { timestamps: true },
);

meroSchema.index({ username: 1, userID: 1 }, { unique: true });

const MeroShareAccountModel: mongoose.Model<MeroShareAccountType> =
  mongoose.models.MeroShareAccount ||
  (await Database.connect(),
  mongoose.model<MeroShareAccountType>("MeroShareAccount", meroSchema));

export default MeroShareAccountModel;
