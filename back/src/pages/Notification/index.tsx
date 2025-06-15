import React, { useEffect } from "react";
import { useNotifications } from "../../contexts/notification-context";
import "./Notification.css";

export const NotificationPage = () => {
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    const unreadNotifications = notifications.some(
      (notification) => !notification.read && new Date(notification.dueDate) >= new Date()
    );
    const notificationTab = document.querySelector(".notification-tab");
    if (notificationTab) {
      if (unreadNotifications) {
        notificationTab.classList.add("unread");
      } else {
        notificationTab.classList.remove("unread");
      }
    }
  }, [notifications]);

  const getStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    return date >= new Date() ? "Due" : "Expired";
  };

  return (
    <div className="notification-container">
      <h1>Here you see Dreadful Notifications</h1>
      <table className="notification-table">
        <thead>
          <tr>
            <th>Notification</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td
                className={`notification-item ${notification.read ? "read" : "unread"}`}
                onClick={() => markAsRead(notification.id)}
              >
                {notification.message}
              </td>
              <td>{getStatus(notification.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};