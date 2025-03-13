
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNotifications } from "../server/admin/notification";

interface NotificationItem {
  id: string;
  message: string;
  avatar?: string;
  bgColor?: string;
  icon?: string;
  createdAt: string;
}

const AllNotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await getAllNotifications(searchQuery);
        setNotifications(response || []); 
      } catch (error) {
        console.error("Error fetching all notifications:", error);
        setNotifications([]); 
      }
    };

    fetchAllNotifications();
  }, [searchQuery]);

  return (
    <div className="container mt-4">
      <h2>All Notifications</h2>
      
      {/* <input
        type="text"
        className="form-control mb-3"
        placeholder="Search notifications..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      /> */}

      <div className="list-group">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={notification.id} className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">
                  {/* Display the index + 1 (to start numbering from 1 instead of 0) */}
                  {index + 1}. {notification.message}
                </h5>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
              {notification.avatar && (
                <img
                  src={notification.avatar}
                  alt="Notification"
                  className="img-fluid rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
              )}
              <p className="mb-1">{notification.message}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No notifications found.</p>
        )}
      </div>

      <Link to="/" className="btn btn-primary mt-3">
        Back to Home
      </Link>
    </div>
  );
};

export default AllNotificationsPage;