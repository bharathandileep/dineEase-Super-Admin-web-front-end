import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import { Modal, Button } from "react-bootstrap";
interface ProfileMenuItem {
  label: string;
  icon: string;
  redirectTo: string;
}

interface ProfileDropdownProps {
  menuItems: Array<ProfileMenuItem>;
  profilePic?: string;
  username: string;
  userTitle?: string;
}

const ProfileDropdown = (props: ProfileDropdownProps) => {
  const profilePic = props["profilePic"] || null;
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  /*
   * toggle profile-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/auth/logout");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-profile"
          as="a"
          onClick={toggleDropdown}
          className={classNames(
            "nav-link nav-user me-0 waves-effect waves-light",
            { show: dropdownOpen }
          )}
        >
          <img src={profilePic!} className="rounded-circle" alt="" />
          <span className="pro-user-name ms-1">
            {props["username"]} <i className="mdi mdi-chevron-down"></i>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-end profile-dropdown">
          <div onClick={toggleDropdown}>
            <div className="dropdown-header noti-title">
              <h6 className="text-overflow m-0">Welcome !!</h6>
            </div>
            {(props.menuItems || []).map((item, i) => {
              return (
                <React.Fragment key={i}>
                  {i === props["menuItems"].length - 1 && (
                    <div className="dropdown-divider"></div>
                  )}
                  {item.label != "Logout" ? (
                    <Link
                      to={item.redirectTo}
                      className="dropdown-item notify-item"
                      key={i + "-profile-menu"}
                    >
                      <i className={`${item.icon} me-1`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className="dropdown-item notify-item border-0 bg-transparent text-start w-100"
                      onClick={handleLogoutClick}
                      key={i + "-profile-menu"}
                    >
                      <i className={`${item.icon} me-1`}></i>
                      <span>{item.label}</span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        show={showLogoutModal}
        onHide={handleCancelLogout}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">
            Confirm Logout
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          <div className="text-center">
            <div className="mb-3">
              <i
                className="mdi mdi-help-circle-outline text-warning"
                style={{ fontSize: "48px" }}
              ></i>
            </div>
            <h5 className="mb-3">Are you sure you want to logout?</h5>
            <p className="text-muted mb-0">
              You will need to sign in again to access your account.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            onClick={handleCancelLogout}
            className="me-2"
          >
            <i className="mdi mdi-close me-1"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            <i className="mdi mdi-logout me-1"></i>
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileDropdown;
