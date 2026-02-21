import Database from "@/server/db/db-config";
import mongoose, { Schema, Document } from "mongoose";

export interface MeroShareBankType extends Document {
  code: string;
  id: number;
  name: string;
}

export interface MeroShareBankResponse {
  code: string;
  id: number;
  name: string;
}

const bankSchema = new Schema<MeroShareBankType>({
  code: { type: String },
  id: { type: Number },
  name: { type: String },
});

const MeroShareBankModel: mongoose.Model<MeroShareBankType> =
  mongoose.models.MeroShareBank ||
  (await Database.connect(),
  mongoose.model<MeroShareBankType>("MeroShareBank", bankSchema));

export default MeroShareBankModel;
