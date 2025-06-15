import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface DebtRecord {
  _id?: string;
  userId: string;
  category: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
  repayments: { date: Date; amount: number }[];
}

interface DebtRecordsContextType {
  debts: DebtRecord[];
  addDebt: (debt: DebtRecord) => void;
  updateDebt: (id: string, newDebt: DebtRecord) => void;
  deleteDebt: (id: string) => void;
  calculateEndDate: (debt: DebtRecord) => Date;
}

export const DebtRecordsContext = createContext<DebtRecordsContextType | undefined>(undefined);

export const DebtRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const { user } = useUser();

  const fetchDebts = async () => {
    if (!user) return;
    const response = await fetch(`http://localhost:3001/debt-records/getAllByUserID/${user.id}`);
    if (response.ok) {
      const debts = await response.json();
      setDebts(debts);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [user]);

  const addDebt = async (debt: DebtRecord) => {
    const response = await fetch("http://localhost:3001/debt-records", {
      method: "POST",
      body: JSON.stringify(debt),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const newDebt = await response.json();
      setDebts((prev) => [...prev, newDebt]);
    }
  };

  const updateDebt = async (id: string, newDebt: DebtRecord) => {
    const response = await fetch(`http://localhost:3001/debt-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(newDebt),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const updatedDebt = await response.json();
      setDebts((prev) => prev.map((debt) => (debt._id === id ? updatedDebt : debt)));
    }
  };

  const deleteDebt = async (id: string) => {
    const response = await fetch(`http://localhost:3001/debt-records/${id}`, { method: "DELETE" });
    if (response.ok) {
      setDebts((prev) => prev.filter((debt) => debt._id !== id));
    }
  };

  const calculateEndDate = (debt: DebtRecord): Date => {
    // Implement logic to calculate the end date based on current repayment rate
    return new Date(); // Placeholder
  };

  return (
    <DebtRecordsContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, calculateEndDate }}>
      {children}
    </DebtRecordsContext.Provider>
  );
};

export const useDebtRecords = () => {
  const context = useContext(DebtRecordsContext);
  if (!context) throw new Error("useDebtRecords must be used within a DebtRecordsProvider");
  return context;
};