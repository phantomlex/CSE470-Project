import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";
import ImportExportCSV from "./importExportcsv"; // Import the new component

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    records.forEach((record) => {
      if (record.category === 'Salary' || record.category === 'Freelancing') {
        income += record.amount;
      } else {
        expenses += record.amount;
      }
    });

    return {
      income,
      expenses,
      available: income - expenses
    };
  }, [records]);

  return (
    <div className="dashboard-container">
      <h1> Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <FinancialRecordForm />
      <div className="totals-container">
        <div className="total-item income">Income: ${totals.income.toFixed(2)}</div>
        <div className="total-item expenses">Expenses: ${(totals.expenses.toFixed(2))}</div>
        <div className="total-item available">Available: ${totals.available.toFixed(2)}</div>
      </div>
      <FinancialRecordList />
      <ImportExportCSV /> {/* Use the new component here */}
    </div>
  );
};
