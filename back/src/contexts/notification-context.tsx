import React, { createContext, useContext, useEffect, useState } from "react";
import { useDebtRecords } from "./debt-record-context";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  dueDate: string;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { debts } = useDebtRecords();

  useEffect(() => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to one day after today

    console.log("Today's date:", today.toISOString().split('T')[0]);
    console.log("Tomorrow's date:", tomorrow.toISOString().split('T')[0]);

    debts.forEach((debt) => {
      const dueDate = new Date(debt.dueDate); // Ensure dueDate is a Date object
      console.log("Debt due date:", dueDate.toISOString().split('T')[0]);

      if (dueDate.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
        console.log("Matching due date found:", dueDate.toISOString().split('T')[0]);
        newNotifications.push({
          id: `debt-${debt._id}`,
          message: `Debt payment due for ${debt.category}`,
          read: false,
          dueDate: dueDate.toISOString().split('T')[0], // Convert to ISO string
        });
      }
    });

    console.log("Generated notifications:", newNotifications);

    setNotifications(newNotifications);
  }, [debts]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};