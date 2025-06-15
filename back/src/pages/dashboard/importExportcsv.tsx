// importExportcsv.tsx
import React from 'react';
import { useUser  } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import Papa from "papaparse";

const ImportExportCSV = () => {
  const { user } = useUser ();
  const { records, addRecord } = useFinancialRecords();

  // Handle CSV Import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          results.data.forEach((record: any) => {
            const newRecord = {
              userId: user?.id ?? "",
              date: new Date(record.date),
              description: record.description,
              amount: parseFloat(record.amount),
              category: record.category,
              paymentMethod: record.paymentMethod,
            };
            addRecord(newRecord); // Add each record to the financial records
          });
        },
      });
    }
  };

  // Handle CSV Export
  const handleExport = () => {
    // Create a new array excluding _id and userId
    const filteredRecords = records.map(({ _id, userId, __v, ...rest }) => rest);
    
    const csv = Papa.unparse(filteredRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "financial_records.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="button-container">
      <button className="button" onClick={() => document.getElementById('file-upload').click()}>
        Import CSV
      </button>
      <input 
        id="file-upload"
        type="file" 
        accept=".csv" 
        onChange={handleImport} 
        style={{ display: 'none', }} // Hide the default file input
      />
      <button className="button" onClick={handleExport}>Export</button>
    </div>
  );
};

export default ImportExportCSV;