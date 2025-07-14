import React, { useState } from "react";
import { Nav, Image } from "react-bootstrap";
import {
  User,
  Home,
  Building,
  Settings,
  HelpCircle,
  Users,
  LogOut,
} from "lucide-react";
import { TabKey, User as UserType } from "../../../types/profile";
import "./ProfilePage.scss";

interface UserSidebarProps {
  // user: UserType;
  user: any;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onLogout?: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navItems = [
    { id: "account" as const, label: "Account Details", icon: User },
    { id: "restaurants" as const, label: "Your Organisations", icon: Home },
    { id: "kitchens" as const, label: "Your Kitchens", icon: Building },
    // { id: "settings" as const, label: "Settings", icon: Settings },
    // { id: "support" as const, label: "Support / Help", icon: HelpCircle },
    // { id: "referral" as const, label: "Referral / Invite", icon: Users },
  ];

  return (
    <>
      <div className="bg-white border-end d-flex flex-column h-90 min-vh-90">
        <div className="text-center mb-2 pt-3 px-1">
          <div className="border border-3 border-bg-primary rounded-circle d-inline-block">
            <Image
              src={user.profile_photo}
              alt={`${user.fullName}`}
              roundedCircle
              width={100}
              height={100}
              className="border border-2 border-white object-fit-cover"
            />
          </div>

          <h5 className="mb-1">{user.fullName}</h5>
          <p className="text-muted small">{user.email}</p>
        </div>
        <div className="flex-grow-1  px-1">
          <Nav className="flex-column">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Nav.Link
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`d-flex align-items-center nav-item rounded mb-1 ${
                    activeTab === item.id
                      ? "bg-warning bg-opacity-10 text-warning fw-semibold border-start border-warning border-4"
                      : "text-dark"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <Icon className="me-3" size={20} />
                  <span>{item.label}</span>
                </Nav.Link>
              );
            })}
          </Nav>
        </div>

        {/* Fixed Logout Button at Bottom */}
        <div className="px-1 pb-3">
          <Nav.Link
            className="d-flex align-items-center py-2 px-3 rounded text-danger"
            style={{ cursor: "pointer" }}
            onClick={onLogout}
          >
            <LogOut className="me-3" size={20} />
            <span>Logout</span>
          </Nav.Link>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
