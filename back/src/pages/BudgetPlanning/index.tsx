import { useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useBudgetRecords } from "../../contexts/budget-record-context";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useTable, Column, CellProps, useSortBy } from "react-table";
import './BudgetPlanning.css';

interface EditableCellProps extends CellProps<any> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

interface BudgetRecord {
  _id: string;
  category: string;
  budget: number;
  actualSpending: number;
  userId: string;
}

interface TableRecord extends BudgetRecord {
  difference: number;
  status: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

export const BudgetPlanning = () => {
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    budget: "",
  });
  const { user } = useUser();
  const { addBudget, updateBudget, deleteBudget, budgets } = useBudgetRecords();
  const { records } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = budgets[rowIndex]?._id;
    if (id) {
      updateBudget(id, { ...budgets[rowIndex], [columnId]: parseFloat(value) });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setBudgetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!budgetForm.category || !budgetForm.budget) {
      alert("Please fill in all fields for the budget.");
      return;
    }

    try {
      console.log("Budget Form Data:", budgetForm);
      await addBudget({
        category: budgetForm.category,
        budget: parseFloat(budgetForm.budget),
        userId: user?.id || "",
        actualSpending: 0,
      });
      console.log("Budget added successfully");
      setBudgetForm({ category: "", budget: "" });
    } catch (error) {
      console.error("Failed to add budget:", error);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);
      alert("Budget deleted successfully!");
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget.");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
        sortType: "alphanumeric",
      },
      {
        Header: "Budget",
        accessor: "budget",
        sortType: "number",
        Cell: ({ row, value, column }: any) => (
          <EditableCell
            value={value}
            row={row}
            column={column}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Actual Spending",
        accessor: "actualSpending",
        sortType: "number",
      },
      {
        Header: "Difference",
        accessor: "difference",
        sortType: "number",
      },
      {
        Header: "Status",
        accessor: "status",
        sortType: "alphanumeric",
      },
      {
        Header: "Delete",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ value }: { value: string }) => (
          <button onClick={() => handleDeleteBudget(value)}>Delete</button>
        ),
      },
    ],
    []
  );

  const data: TableRecord[] = useMemo(
    () =>
      budgets.map((record) => {
        const actualSpending = records
          .filter((r) => r.category === record.category)
          .reduce((sum, r) => sum + r.amount, 0);

        const difference = record.budget - actualSpending;
        let status;
        
        if (difference > 0) {
          status = `Under budget by ${difference}`;
        } else if (difference < 0) {
          status = `Over budget by ${Math.abs(difference)}`;
        } else {
          status = "Exactly on budget";
        }

        return {
          ...record,
          actualSpending,
          difference: Math.abs(difference),
          status,
        };
      }),
    [budgets, records]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy: [] }
    },
    useSortBy
  );

  return (
    <div className="budget-container">
      <h1>Set Your Monthly Budget</h1>
      <form onSubmit={handleCategorySubmit} className="form-container">
        <div className="form-field">
          <label htmlFor="category">Select Category:</label>
          <select
            name="category"
            required
            className="select-input"
            value={budgetForm.category}
            onChange={handleInputChange}
          >
            <option value="">-- Select a Category --</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="budget">Budget Amount:</label>
          <input
            type="number"
            name="budget"
            required
            className="input"
            min="0"
            step="0.01"
            placeholder="Enter amount in Taka"
            value={budgetForm.budget}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="button">
          Set Budget
        </button>
      </form>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " ▼"
                        : " ▲"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};