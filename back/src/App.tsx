import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { BudgetRecordsProvider } from "./contexts/budget-record-context";
import { SavingRecordsProvider } from "./contexts/saving-record-context";
import { DebtRecordsProvider } from "./contexts/debt-record-context";
import { NotificationProvider } from "./contexts/notification-context";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ChartComponent } from "./pages/DataVisualization";
import { BudgetPlanning } from "./pages/BudgetPlanning";
import { SavingsGoal } from "./pages/SavingsGoal";
import { DebtManagement } from "./pages/DebtManagement";
import { NotificationPage } from "./pages/Notification";

function App() {
  return (
    <Router>
      <div className="app-container">
        <SignedIn>
          <div className="navbar">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/visualization">Data Visualization</Link>
            <Link to="/budget">Budget Planning</Link>
            <Link to="/savings">Savings Goal</Link>
            <Link to="/debt">Debt Management</Link>
            <Link to="/notifications" className="notification-tab">
              Notifications
            </Link>
            <UserButton />
          </div>
        </SignedIn>
        
        <Routes>
          <Route
            path="/"
            element={
              <SignedOut>
                <Auth />
              </SignedOut>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <FinancialRecordsProvider>
                  <Dashboard />
                </FinancialRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/visualization"
            element={
              <SignedIn>
                <FinancialRecordsProvider>
                  <ChartComponent />
                </FinancialRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/budget"
            element={
              <SignedIn>
                <FinancialRecordsProvider>
                  <BudgetRecordsProvider>
                    <BudgetPlanning />
                  </BudgetRecordsProvider>
                </FinancialRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/savings"
            element={
              <SignedIn>
                <SavingRecordsProvider>
                  <SavingsGoal />
                </SavingRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/debt"
            element={
              <SignedIn>
                <DebtRecordsProvider>
                  <DebtManagement />
                </DebtRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/notifications"
            element={
              <SignedIn>
                <DebtRecordsProvider>
                  <BudgetRecordsProvider>
                    <NotificationProvider>
                      <NotificationPage />
                    </NotificationProvider>
                  </BudgetRecordsProvider>
                </DebtRecordsProvider>
              </SignedIn>
            }
          />
          <Route
            path="/"
            element={
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;