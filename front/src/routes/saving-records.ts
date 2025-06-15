import express, { Request, Response } from "express";
import SavingRecordModel from "../schema/saving-record";

const router = express.Router();



router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await SavingRecordModel.find({ userId });
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecord = new SavingRecordModel(req.body);
    const savedRecord = await newRecord.save();
    res.status(200).send(savedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const record = await SavingRecordModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const record = await SavingRecordModel.findByIdAndDelete(req.params.id);
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});



router.patch("/:id", async (req: Request, res: Response): Promise<any>=>  {
  try {
    const updatedRecord = await SavingRecordModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send(updatedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
