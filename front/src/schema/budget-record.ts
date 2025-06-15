import mongoose from "mongoose";

interface BudgetRecord {
  userId: string;
  category: string;
  budget: number;
}

const budgetRecordSchema = new mongoose.Schema<BudgetRecord>({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
});

// The name of the collection will be 'budgetrecords'

export const BudgetRecordModel = 
  mongoose.models.BudgetRecord || 
  mongoose.model<BudgetRecord>("BudgetRecord", budgetRecordSchema);

export default BudgetRecordModel;
