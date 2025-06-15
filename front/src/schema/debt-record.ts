import mongoose, { Schema, Document } from "mongoose";

interface IDebtRecord extends Document {
  userId: string;
  category: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
  repayments: { date: Date; amount: number }[];
}

const DebtRecordSchema: Schema = new Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  repayments: [{ date: { type: Date, required: true }, amount: { type: Number, required: true } }],
});

const DebtRecordModel = mongoose.models.DebtRecord || mongoose.model<IDebtRecord>("DebtRecord", DebtRecordSchema);

export default DebtRecordModel;