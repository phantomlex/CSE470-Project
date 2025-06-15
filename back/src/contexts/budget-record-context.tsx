import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface BudgetRecord {
  _id?: string;
  userId: string;
  category: string;
  budget: number;
  actualSpending: number;
}

interface BudgetRecordsContextType {
  budgets: BudgetRecord[];
  addBudget: (budget: BudgetRecord) => void;
  updateBudget: (id: string, newBudget: BudgetRecord) => void;
  deleteBudget: (id: string) => void;
}

export const BudgetRecordsContext = createContext<BudgetRecordsContextType | undefined>(undefined);

export const BudgetRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const { user } = useUser();

  const fetchBudgets = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3001/budget-records/getAllByUserID/${user.id}`);
      if (response.ok) {
        const budgets = await response.json();
        setBudgets(budgets);
      }
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const addBudget = async (budget: BudgetRecord) => {
    try {
      const response = await fetch("http://localhost:3001/budget-records", {
        method: "POST",
        body: JSON.stringify(budget),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const newBudget = await response.json();
        setBudgets((prev) => [...prev, newBudget]);
      }
    } catch (err) {
      console.error("Error adding budget:", err);
    }
  };

  const updateBudget = async (id: string, newBudget: BudgetRecord) => {
    try {
      const response = await fetch(`http://localhost:3001/budget-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newBudget),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const updatedBudget = await response.json();
        setBudgets((prev) => prev.map((budget) => (budget._id === id ? updatedBudget : budget)));
      }
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      console.log("Deleting budget with id:", id); // Log the ID you're trying to delete
      
      const response = await fetch(`http://localhost:3001/budget-records/${id}`, {
        method: "DELETE",
      });
  
      console.log("Response status:", response.status); // Log the response status
  
      if (response.ok) {
        // Remove the deleted budget from the state
        setBudgets((prev) =>
          prev.filter((budget) => budget._id !== id)
        );
      } else {
        const result = await response.json();
        console.log("Error message from server:", result.message); // Log the error message from the server
        alert(result.message || "Failed to delete budget record.");
      }
    } catch (err) {
      console.error("Error deleting budget record:", err);
      alert("An error occurred while deleting the budget record.");
    }
  };

  return (
    <BudgetRecordsContext.Provider value={{ budgets, addBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetRecordsContext.Provider>
  );
};

export const useBudgetRecords = () => {
  const context = useContext<BudgetRecordsContextType | undefined>(BudgetRecordsContext);
  if (!context) throw new Error("useBudgetRecords must be used within a BudgetRecordsProvider");
  return context;
};