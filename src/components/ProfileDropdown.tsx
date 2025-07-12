import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import { Modal, Button } from "react-bootstrap";
import LogoutModal from "./LogoutModal";
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
  const handleCloseLogout = () => {
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
      <LogoutModal
        showLogoutModal={showLogoutModal}
        onHide={handleCloseLogout}
      />
    </>
  );
};

export default ProfileDropdown;
