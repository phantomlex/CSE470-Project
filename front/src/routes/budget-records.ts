import express, { Request, Response } from "express";
import BudgetRecordModel from "../schema/budget-record";

const router = express.Router();
router.get("/getAllByUserID/:userId", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.userId;
    const records = await BudgetRecordModel.find({ userId });
    if (records.length === 0) {
        return res.status(404).send("No records found for the user.");
      }
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving budget records", error: err });
  }
});

router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    //const newBudegetRecordBody = req.body;
    const newBudgetRecord = new BudgetRecordModel(req.body);
    const savedRecord = await newBudgetRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(500).json({ message: "Error creating budget record", error: err });
  }
});


router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const updatedRecord = await BudgetRecordModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ message: "Budget record not found" });
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: "Error updating budget record", error: err });
  }
});


import mongoose from "mongoose";

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  console.log("Received DELETE request with ID:", id);  // Log the ID for debugging

  // Validate the ObjectId format before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid budget record ID format" });
  }

  try {
    const deletedRecord = await BudgetRecordModel.findByIdAndDelete(id);

    // Check if no record is found
    if (!deletedRecord) {
      return res.status(404).json({ message: "Budget record not found" });
    }

    res.status(200).json({ message: "Budget record deleted successfully", deletedRecord });
  } catch (err) {
    res.status(500).json({ message: "Error deleting budget record", error: err });
  }
});





export default router;
