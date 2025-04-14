import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import classNames from "classnames";

import { NotificationItem } from "../layouts/Topbar";
import { getAllNotifications } from "../server/admin/notification";
import {
  getAccessDetailsFromLocalStorage,
  getContext,
} from "../helpers/api/utils";

const notificationContainerStyle = {
  maxHeight: "300px",
  display: "none",
};

const notificationShowContainerStyle = {
  maxHeight: "300px",
  display: "block",
};

interface NotificationDropdownProps {
  notifications?: NotificationItem[];
}

interface NotificationContainerStyle {
  maxHeight?: string;
  display?: string;
}

const NotificationDropdown = (props: NotificationDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationContentStyle, setNotificationContentStyles] =
    useState<NotificationContainerStyle>(notificationContainerStyle);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    props.notifications || []
  );
  const userInfo = getAccessDetailsFromLocalStorage();
  const authContextDetails = getContext();

  const [notificationPath, setNotificationPath] = useState<string>("");
  /*c
   * toggle notification-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationContentStyles(
      notificationContentStyle === notificationContainerStyle
        ? notificationShowContainerStyle
        : notificationContainerStyle
    );
  };

  const fetchNotifications = async () => {
    try {
      const allNotifications = await getAllNotifications("");

      // Check if the logged-in user is Admin
      if (userInfo.role === "Admin") {
        setNotifications(allNotifications);
      } else {
        // Set empty or filter out user-specific notifications if needed
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // if (userInfo.role === "Kitchen") {
    //   setNotificationPath("/apps/kitchen/notifications");
    // }
    // if (userInfo.role === "Organization") {
    //   setNotificationPath("/apps/organizations/notifications");
    // }
    if (userInfo.role === "Admin") {
      setNotificationPath("/ui/allnotifications");
    }
  }, [dropdownOpen]);

  const handleClearNotification = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-notification"
        role="button"
        as="a"
        onClick={toggleDropdown}
        className={classNames(
          "nav-link waves-effect waves-light arrow-none notification-list",
          { show: dropdownOpen }
        )}
      >
        <i className="fe-bell noti-icon font-22"></i>
        <span className="badge bg-danger rounded-circle noti-icon-badge">
          {notifications?.length}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
        <div onClick={toggleDropdown}>
          <div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
            <div className="row align-items-center">
              <div className="col">
                <h6 className="m-0 font-16 fw-semibold">Notification</h6>
              </div>
              <div className="col-auto">
                <Link to="#" className="text-dark text-decoration-underline">
                  <small>Clear All</small>
                </Link>
              </div>
            </div>
          </div>
          <SimpleBar className="px-1" style={notificationContentStyle}>
            <h5 className="text-muted font-13 fw-normal mt-2 text-center">
              Today
            </h5>
            {notifications && notifications.length > 0 ? (
              notifications.map((item, i) => (
                <div
                  className="dropdown-item p-0 notify-item card unread-noti shadow-none mb-1"
                  key={i + "-noti"}
                >
                  <div className="card-body">
                    <span
                      className="float-end noti-close-btn text-muted"
                      onClick={() => handleClearNotification(i)}
                    >
                      <i className="mdi mdi-close"></i>
                    </span>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="flex-grow-1 text-truncate text-center">
                        <h5 className="noti-item-title fw-semibold font-14">
                          {item.message}
                        </h5>
                        <small className="noti-item-subtitle text-muted">
                          {item.message}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                <i className="mdi mdi-bell-off-outline fs-3 d-block mb-2"></i>
                No notifications
              </div>
            )}
          </SimpleBar>

          <Link
            to={notificationPath}
            className="dropdown-item text-center text-primary notify-item notify-all"
          >
            View All <i className="fe-arrow-right"></i>
          </Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
