import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import budgetRecordRouter from "./routes/budget-records";
import savingRecordRouter from "./routes/saving-records";
import debtRecordRouter from "./routes/debt-records";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const mongoURI: string = "GENERATE YOURS";

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

app.use("/financial-records", financialRecordRouter);
app.use("/budget-records", budgetRecordRouter);
app.use("/saving-records", savingRecordRouter);
app.use("/debt-records", debtRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
