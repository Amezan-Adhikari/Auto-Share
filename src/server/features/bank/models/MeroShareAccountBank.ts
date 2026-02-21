import Database from "@/server/db/db-config";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface MeroShareAccountBankType extends Document {
  meroShareAccountId: Types.ObjectId;
  bankId: Types.ObjectId;
}

export interface MeroShareAccountBankResponse {
  meroShareAccountId: string;
  bankId: string;
}

const meroShareAccountBankSchema = new Schema<MeroShareAccountBankType>({
  meroShareAccountId: {
    type: Schema.Types.ObjectId,
    ref: "MeroShareAccount",
    required: true,
  },
  bankId: {
    type: Schema.Types.ObjectId,
    ref: "MeroShareBank",
    required: true,
  },
});

meroShareAccountBankSchema.index(
  { meroShareAccountId: 1, bankId: 1 },
  { unique: true },
);

const MeroShareAccountBankModel: mongoose.Model<MeroShareAccountBankType> =
  mongoose.models.MeroShareAccountBank ||
  (await Database.connect(),
  mongoose.model<MeroShareAccountBankType>(
    "MeroShareAccountBank",
    meroShareAccountBankSchema,
  ));

export default MeroShareAccountBankModel;
