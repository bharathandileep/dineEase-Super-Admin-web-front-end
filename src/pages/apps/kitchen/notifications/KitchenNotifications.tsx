import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNotifications } from "../../../../server/admin/notification";


interface NotificationItem {
  id: string;
  message: string;
  avatar?: string;
  bgColor?: string;
  icon?: string;
  createdAt: string;
  type?: "kitchen" | "organization";
}

const KitchenNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]); 
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationItem[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await getAllNotifications(""); 
        setNotifications(response || []);
        setFilteredNotifications(response || []); 
      } catch (error) {
        console.error("Error fetching all notifications:", error);
        setNotifications([]);
        setFilteredNotifications([]);
      }
    };

    fetchAllNotifications();
  }, []); 


  useEffect(() => {
    const filtered = notifications.filter((notification) =>
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotifications(filtered);
  }, [searchQuery, notifications]);

  const getNotificationStyles = (type?: string) => {
    switch (type) {
      case "kitchen":
        return {
          bgClass: "bg-light-success border-success",
          icon: "bi bi-egg-fried text-success me-2",
        };
      case "organization":
        return {
          bgClass: "bg-light-primary border-primary",
          icon: "bi bi-building text-primary me-2",
        };
      default:
        return {
          bgClass: "bg-light border-secondary",
          icon: "bi bi-bell text-secondary me-2",
        };
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold text-dark">Kitchen Notifications</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="list-group">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const styles = getNotificationStyles(notification.type);
            return (
              <div
                key={notification.id}
                className={`list-group-item ${styles.bgClass} mb-3 rounded-3 shadow-sm`}
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <h5 className="mb-1 fw-semibold">
                        <i className={styles.icon}></i>
                        {index + 1}. {notification.message}
                      </h5>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                    {notification.avatar && (
                      <img
                        src={notification.avatar}
                        alt="Notification"
                        className="img-fluid rounded-circle mt-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="alert alert-info text-center" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            No notifications found
          </div>
        )}
      </div>

      <Link
        to="/"
        className="btn btn-outline-primary mt-4 d-block mx-auto w-25"
      >
        <i className="bi bi-house-door me-2"></i>
        Back to Home
      </Link>
    </div>
  );
};

export default KitchenNotifications;