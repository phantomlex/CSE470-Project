import mongoose, { Schema, Document } from "mongoose";

interface ISavingRecord extends Document {
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  remainingAmount: number, // Initialize remaining amount
}

const SavingRecordSchema: Schema = new Schema({
  userId: { type: String, required: true },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, required: true, default: 0 },
  deadline: { type: Date, required: true },
  remainingAmount: { type: Number, required: true }, // New field
});

const SavingRecordModel = 
  mongoose.models.SavingRecord || 
  mongoose.model<ISavingRecord>("SavingRecord", SavingRecordSchema);

export default SavingRecordModel;
