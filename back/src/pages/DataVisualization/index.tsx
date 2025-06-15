import React, { useRef, useEffect } from "react";
import { Line, Pie, Column } from '@ant-design/charts';
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";

interface DataPoint {
  date: string;
  value: number;
}

export const ChartComponent: React.FC = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const getProcessedAmount = (record: any) => {
    return record.category === 'Salary' || record.category === 'Freelancing'
      ? record.amount
      : -Math.abs(record.amount); // Make expenses negative
  };

  const getCurrentDayData = () => {
    const today = new Date();
    return records
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getDate() === today.getDate() && 
               recordDate.getMonth() === today.getMonth() && 
               recordDate.getFullYear() === today.getFullYear();
      })
      .map(record => ({
        time: new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: getProcessedAmount(record),
        category: record.category
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getCurrentMonthPieData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const colorMap: { [key: string]: string } = {};
    for (let i = 1; i <= 31; i++) {
      colorMap[i.toString()] = `hsl(${(i * 11) % 360}, 70%, 50%)`;
    }

    const filteredData = records
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
      });

    // Group by day and sum values
    const groupedData = filteredData.reduce((acc: { [key: string]: number }, record) => {
      const day = new Date(record.date).getDate().toString();
      acc[day] = (acc[day] || 0) + getProcessedAmount(record);
      return acc;
    }, {});

    // Convert to final format with colors
    return Object.entries(groupedData).map(([day, value]) => ({
      type: `Day ${day}`,
      value,
      color: colorMap[day]
    }));
  };

  const getLifetimeData = (): DataPoint[] => {
    if (!records || records.length === 0) return [];

    const sortedRecords = [...records]
      .filter(record => 
        record.amount != null && 
        !isNaN(record.amount)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by month and year
    const monthlyData = sortedRecords.reduce((acc: { [key: string]: number }, record) => {
      const date = new Date(record.date);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const amount = getProcessedAmount(record);
      acc[key] = (acc[key] || 0) + amount;
      return acc;
    }, {});

    // Convert to array format and ensure values are numbers
    return Object.entries(monthlyData)
      .map(([date, value]) => ({
        date,
        value: Number(value.toFixed(2))  // Round to 2 decimal places and ensure it's a number
      }));
  };

  const getYearlyData = () => {
    const currentYear = new Date().getFullYear();
    const monthlyTotals: { [key: string]: number } = {};
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => monthlyTotals[month] = 0);

    records
      .filter(record => 
        new Date(record.date).getFullYear() === currentYear
      )
      .forEach(record => {
        const month = new Date(record.date).toLocaleString('default', { month: 'short' });
        monthlyTotals[month] += getProcessedAmount(record);
      });

    // Convert to array format
    return months.map(month => ({
      month,
      value: monthlyTotals[month]
    }));
  };

  const baseConfig = {
    width: 600,
    height: 300,
    autoFit: false,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: { fill: '#aaa' },
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
      <div>
        <h3>Today's Transactions</h3>
        <Line {...{
          ...baseConfig,
          data: getCurrentDayData(),
          xField: 'time',
          yField: 'value',
          seriesField: 'category',
          xAxis: { 
            title: { text: 'Time of Day' },
            label: { rotate: 45 }
          },
          tooltip: {
            title: 'Category',
            formatter: (datum: any) => ({
              name: datum.category,
              value: `$${Math.abs(datum.value).toFixed(2)} (${datum.value < 0 ? 'Expense' : 'Income'})`
            })
          }
        }} />
      </div>
      <div>
        <h3>Current Month</h3>
        <Pie
          data={getCurrentMonthPieData()}
          angleField='value'
          colorField='type'
          radius={.8
  
          }
          color={({ color }: { color: string }) => color}
          label={{
            type: 'outer',
            content: '{name}: ${value}'
          }}
          {...{
            width: 600,
            height: 300,
            autoFit: false,
          }}
        />
      </div>
      <div>
        <h3>Lifetime Statistics</h3>
        <Line {...{
          ...baseConfig,
          data: getLifetimeData(),
          xField: 'date',
          yField: 'value',
          xAxis: { 
            title: { text: 'Month-Year' },
            label: { rotate: 45 }
          },
        }} />
      </div>
      <div>
        <h3>This Year</h3>
        <Column {...{
          width: 600,
          height: 300,
          autoFit: false,
          data: getYearlyData(),
          xField: 'month',
          yField: 'value',
          xAxis: { 
            title: { text: 'Month' },
          },
          yAxis: {
            nice: true,
            minInterval: 1000,
          },
          columnStyle: {
            radius: [4, 4, 0, 0],
          },
          label: {
            position: 'top',
            style: { fill: '#666' }
          },
          maxColumnWidth: 40,
          minColumnWidth: 20,
        }} />
      </div>
    </div>
  );
};

export default ChartComponent;
