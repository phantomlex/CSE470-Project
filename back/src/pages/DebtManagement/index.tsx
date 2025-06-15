import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDebtRecords, DebtRecord } from "../../contexts/debt-record-context";
import './DebtManagement.css';

export const DebtManagement = () => {
  const [debtForm, setDebtForm] = useState({
    category: "",
    amount: "",
    interestRate: "",
    dueDate: "",
  });

  const { user } = useUser();
  const { addDebt, debts, updateDebt, deleteDebt } = useDebtRecords();
  const [addAmount, setAddAmount] = useState<{ [key: string]: number }>({});
  const [afterAddAmount, setAfterAddAmount] = useState<{ [key: string]: number }>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDebtForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDebtSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!debtForm.category || !debtForm.amount || !debtForm.interestRate || !debtForm.dueDate) {
      alert("Please fill in all fields for the debt.");
      return;
    }

    const newDebt: DebtRecord = {
      userId: user?.id ?? "",
      category: debtForm.category,
      amount: parseFloat(debtForm.amount),
      interestRate: parseFloat(debtForm.interestRate),
      dueDate: new Date(debtForm.dueDate),
      repayments: [],
    };

    try {
      await addDebt(newDebt);
      setDebtForm({ category: "", amount: "", interestRate: "", dueDate: "" });
      alert("Debt added successfully!");
    } catch (error) {
      console.error("Error adding debt:", error);
      alert("Failed to add debt.");
    }
  };

  const handleAddAmountSubmit = async (debtId: string) => {
    const amount = addAmount[debtId];
    if (!amount || amount <= 0) return;

    try {
      const debtToUpdate = debts.find((debt) => debt._id === debtId);
      if (!debtToUpdate) return;

      const totalDue = debtToUpdate.amount + (debtToUpdate.amount * debtToUpdate.interestRate) / 100;
      if (totalDue - amount < 0) {
        alert("Total Due cannot be less than 0.");
        return;
      }

      setAfterAddAmount((prev) => ({
        ...prev,
        [debtId]: totalDue - amount,
      }));

      setAddAmount((prev) => ({ ...prev, [debtId]: 0 })); // Reset the input field
    } catch (error) {
      console.error("Error updating debt:", error);
    }
  };

  const handleDeleteDebt = async (debtId: string) => {
    try {
      await deleteDebt(debtId);
      alert("Debt deleted successfully!");
    } catch (error) {
      console.error("Error deleting debt:", error);
      alert("Failed to delete debt.");
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

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key || sortConfig.direction === null) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const getSortedDebts = () => {
    if (!sortConfig.direction) {
      return debts;
    }

    return [...debts].sort((a, b) => {
      if (['amount', 'interestRate'].includes(sortConfig.key)) {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      } else if (sortConfig.key === 'totalDue') {
        const totalDueA = a.amount + (a.amount * a.interestRate) / 100;
        const totalDueB = b.amount + (b.amount * b.interestRate) / 100;
        return sortConfig.direction === 'asc'
          ? totalDueA - totalDueB
          : totalDueB - totalDueA;
      } else {
        const aValue = String(a[sortConfig.key as keyof DebtRecord] || '');
        const bValue = String(b[sortConfig.key as keyof DebtRecord] || '');
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });
  };

  return (
    <div className="debt-container">
      <h1>Manage Your Debts</h1>

      <form onSubmit={handleDebtSubmit} className="form-container">
        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            required
            className="select-input"
            value={debtForm.category}
            onChange={handleInputChange}
          >
            <option value="">-- Select a Category --</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Loan">Loan</option>
            <option value="Mortgage">Mortgage</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            name="amount"
            required
            className="input"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            value={debtForm.amount}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="interestRate">Interest Rate:</label>
          <input
            type="number"
            name="interestRate"
            required
            className="input"
            min="0"
            step="0.01"
            placeholder="Enter interest rate"
            value={debtForm.interestRate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            required
            className="input"
            value={debtForm.dueDate}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="button">
          Add Debt
        </button>
      </form>

      <h2>Your Debts</h2>
      <table className="debt-table">
        <thead>
          <tr>
            <th onClick={() => sortData('category')}>
              Category {getSortIcon('category')}
            </th>
            <th onClick={() => sortData('amount')}>
              Amount {getSortIcon('amount')}
            </th>
            <th onClick={() => sortData('interestRate')}>
              Interest Rate {getSortIcon('interestRate')}
            </th>
            <th onClick={() => sortData('dueDate')}>
              Due Date {getSortIcon('dueDate')}
            </th>
            <th onClick={() => sortData('totalDue')}>
              Total Due {getSortIcon('totalDue')}
            </th>
            <th>Add Amount</th>
            <th>After Add Amount</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {getSortedDebts().map((debt) => {
            const totalDue = debt.amount + (debt.amount * debt.interestRate) / 100;
            const afterAddAmountValue = afterAddAmount[debt._id ?? ""] || totalDue;
            return (
              <tr key={debt._id}>
                <td>{debt.category}</td>
                <td>${debt.amount}</td>
                <td>{debt.interestRate}%</td>
                <td>{new Date(debt.dueDate).toLocaleDateString()}</td>
                <td>${totalDue.toFixed(2)}</td>
                <td>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddAmountSubmit(debt._id ?? "");
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      placeholder="Amount"
                      value={addAmount[debt._id ?? ""] || ""}
                      onChange={(e) =>
                        setAddAmount((prev) => ({
                          ...prev,
                          [debt._id ?? ""]: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                    <button type="submit">Submit</button>
                  </form>
                </td>
                <td>${afterAddAmountValue.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDeleteDebt(debt._id ?? "")}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};