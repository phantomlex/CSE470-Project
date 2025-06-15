import express, { Request, Response } from "express";
import DebtRecordModel from "../schema/debt-record";

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await DebtRecordModel.find({ userId });
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecord = new DebtRecordModel(req.body);
    const savedRecord = await newRecord.save();
    res.status(200).send(savedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const record = await DebtRecordModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const record = await DebtRecordModel.findByIdAndDelete(req.params.id);
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;