import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";


export interface SavingRecord {
  _id?: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  remainingAmount: number,
}

interface SavingRecordsContextType {
  savings: SavingRecord[];
  addSaving: (saving: SavingRecord) => void;
  updateSaving: (id: string, newSaving: SavingRecord) => void;
  deleteSaving: (id: string) => void;
}

export const SavingRecordsContext = createContext<SavingRecordsContextType | undefined>(undefined);

export const SavingRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [savings, setSavings] = useState<SavingRecord[]>([]);
  const { user } = useUser();

  const fetchSavings = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3001/saving-records/getAllByUserID/${user.id}`);
      if (response.ok) {
        const savingsData = await response.json();
        setSavings(savingsData);
      }
    } catch (err) {
      console.error("Error fetching savings:", err);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, [user]);

  const addSaving = async (saving: SavingRecord) => {
    try {
      const response = await fetch("http://localhost:3001/saving-records", {
        method: "POST",
        body: JSON.stringify(saving),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const newSaving = await response.json();
        setSavings((prev) => [...prev, newSaving]);
      }
    } catch (err) {
      console.error("Error adding saving:", err);
    }
  };

  const updateSaving = async (id: string, newSaving: SavingRecord) => {
    try {
      const response = await fetch(`http://localhost:3001/saving-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newSaving),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const updatedSaving = await response.json();
        setSavings((prev) => prev.map((saving) => (saving._id === id ? updatedSaving : saving)));
      }
    } catch (err) {
      console.error("Error updating saving:", err);
    }
  };

  const deleteSaving = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/saving-records/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSavings((prev) => prev.filter((saving) => saving._id !== id));
      }
    } catch (err) {
      console.error("Error deleting saving:", err);
    }
  };

  return (
    <SavingRecordsContext.Provider value={{ savings, addSaving, updateSaving, deleteSaving }}>
      {children}
    </SavingRecordsContext.Provider>
  );
};

export const useSavingRecords = () => {
  const context = useContext<SavingRecordsContextType | undefined>(SavingRecordsContext);
  if (!context) {
    throw new Error("useSavingRecords must be used within a SavingRecordsProvider");
  }
  return context;
};
