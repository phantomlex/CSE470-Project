import React, { useState, useEffect } from "react";
import "./SavingsGoal.css";
import { useUser } from "@clerk/clerk-react";

interface SavingsGoal {
  _id?: string;
  userId: string;
  goalName: string;
  category: string;
  targetAmount: number;
  deadline: string;
  remainingAmount: number; // New field for tracking remaining amount
}

export const SavingsGoal = () => {
  const [goalForm, setGoalForm] = useState<SavingsGoal>({
    userId: "",
    goalName: "",
    category: "",
    targetAmount: 0,
    deadline: "",
    remainingAmount: 0,
  });
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const { user } = useUser();
  const [addAmount, setAddAmount] = useState<{ [key: string]: number }>({}); // Track input values for each goal
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`http://localhost:3001/saving-records/getAllByUserID/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(
          data.map((goal: SavingsGoal) => ({
            ...goal,
            remainingAmount: goal.remainingAmount ?? goal.targetAmount, // Ensure remainingAmount is initialized
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newGoal = {
      ...goalForm,
      userId: user?.id ?? "",
      remainingAmount: goalForm.targetAmount, // Initialize remaining amount with targetAmount
    };

    try {
      const response = await fetch("http://localhost:3001/saving-records", {
        method: "POST",
        body: JSON.stringify(newGoal),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const savedGoal = await response.json();
        setGoals((prev) => [
          ...prev,
          { ...savedGoal, remainingAmount: savedGoal.targetAmount },
        ]);
        setGoalForm({
          userId: "",
          goalName: "",
          category: "",
          targetAmount: 0,
          deadline: "",
          remainingAmount: 0,
        });
      }
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleAddAmountSubmit = async (goalId: string) => {
    const amount = addAmount[goalId];
    if (!amount || amount <= 0) return;

    try {
      const goalToUpdate = goals.find((goal) => goal._id === goalId);
      if (!goalToUpdate) return;

      const updatedGoal = {
        ...goalToUpdate,
        remainingAmount: goalToUpdate.remainingAmount - amount,
      };

      const response = await fetch(`http://localhost:3001/saving-records/${goalId}`, {
        method: "PATCH",
        body: JSON.stringify(updatedGoal),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setGoals((prev) =>
          prev.map((goal) =>
            goal._id === goalId ? { ...goal, remainingAmount: updatedGoal.remainingAmount } : goal
          )
        );
        setAddAmount((prev) => ({ ...prev, [goalId]: 0 })); // Reset the input field
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/saving-records/${goalId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
        alert("Goal deleted successfully!");
      } else {
        alert("Failed to delete goal.");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal.");
    }
  };

  const sortData = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
      else direction = 'asc';
    }

    setSortConfig({ key, direction });
  };

  const getSortedGoals = () => {
    if (!sortConfig.direction) {
      return goals;
    }

    return [...goals].sort((a, b) => {
      if (sortConfig.key === 'targetAmount' || sortConfig.key === 'remainingAmount') {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      
      const aValue = a[sortConfig.key as keyof SavingsGoal] || '';
      const bValue = b[sortConfig.key as keyof SavingsGoal] || '';
      
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key || sortConfig.direction === null) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : '▼';  // Changed to match DebtManagement style
  };

  return (
    <div className="savings-goal-container">
      <h1>Savings Goal</h1>
      <form onSubmit={handleFormSubmit} className="form-container">
        <div className="form-field">
          <label htmlFor="goalName">Goal Name:</label>
          <input
            type="text"
            name="goalName"
            required
            value={goalForm.goalName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            required
            value={goalForm.category}
            onChange={handleInputChange}
          >
            <option value="">-- Select a Category --</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="targetAmount">Target Amount:</label>
          <input
            type="number"
            name="targetAmount"
            required
            placeholder="Enter Amount"
            value={goalForm.targetAmount === 0 ? "" : goalForm.targetAmount}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            name="deadline"
            required
            value={goalForm.deadline}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Goal</button>
      </form>

      <h2>Your Savings Goals</h2>
      <table className="savings-goal-table">
        <thead>
          <tr>
            <th onClick={() => sortData('goalName')}>
              Goal Name {getSortIcon('goalName')}
            </th>
            <th onClick={() => sortData('targetAmount')}>
              Target Amount {getSortIcon('targetAmount')}
            </th>
            <th onClick={() => sortData('remainingAmount')}>
              Remaining Amount {getSortIcon('remainingAmount')}
            </th>
            <th onClick={() => sortData('deadline')}>
              Deadline {getSortIcon('deadline')}
            </th>
            <th>Add Amount</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {getSortedGoals().map((goal) => (
            <tr key={goal._id}>
              <td>{goal.goalName}</td>
              <td>{goal.targetAmount}</td>
              <td>{goal.remainingAmount}</td>
              <td>{goal.deadline}</td>
              <td>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddAmountSubmit(goal._id ?? "");
                  }}
                >
                  <input
                    type="number"
                    min="0"
                    placeholder="Amount"
                    value={addAmount[goal._id ?? ""] || ""}
                    onChange={(e) => {
                      setAddAmount((prev) => ({
                        ...prev,
                        [goal._id ?? ""]: parseFloat(e.target.value) || 0,
                      }));
                    }}
                  />
                  <button type="submit">Submit</button>
                </form>
              </td>
              <td>
                <button onClick={() => handleDeleteGoal(goal._id ?? "")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};