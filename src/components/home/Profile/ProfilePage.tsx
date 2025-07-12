import React, { useState } from "react";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import { Menu } from "lucide-react";
import "./ProfilePage.scss";
import UserSidebar from "./UserSidebar";
import AccountDetailsTab from "./AccountDetailsTab";
import YourKitchensTab from "./YourKitchensTab";
import SettingsTab from "./SettingsTab";
import SupportTab from "./SupportTab";
import ReferralTab from "./ReferralTab";
import LogoutTab from "./LogoutTab";
import { TabKey, User } from "../../../types/profile";
import { mockUser } from "../../../helpers/api/mockData";
import NavbarComponent from "../Navbar";
import YourOrgTab from "./YourOrgTab";
import LogoutModal from "../../LogoutModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const { user } = useSelector((state: RootState) => state.Auth);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleUserUpdate = (updatedUser: User) => {
    // setUser(updatedUser);
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setShowSidebar(false);
  };
  const handleCloseLogout = () => {
    setShowLogoutModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <AccountDetailsTab user={user} onUserUpdate={handleUserUpdate} />
        );
      case "restaurants":
        return <YourOrgTab />;
      case "kitchens":
        return <YourKitchensTab />;
      case "settings":
        return <SettingsTab />;
      case "support":
        return <SupportTab />;
      case "referral":
        return <ReferralTab />;
      case "logout":
        return <LogoutTab />;
      default:
        return (
          <AccountDetailsTab user={user} onUserUpdate={handleUserUpdate} />
        );
    }
  };

  return (
    <>
      <div className="bg-light">
        <NavbarComponent />
        <Container fluid className="p-0 pt-5 h-100 bg-white ">
          <Row className="g-0">
            <Col
              lg={3}
              xl={2}
              className={`d-none d-lg-block profilePage__sidebar`}
            >
              <UserSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={() => setShowLogoutModal(true)}
              />
            </Col>
            <Col lg={3} xl={2} className="d-none d-lg-block" />
            <Col xs={12} className="d-lg-none">
              <div className="bg-white border-bottom p-3 sticky-top shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowSidebar(true)}
                    className="d-flex align-items-center justify-items-center"
                  >
                    <Menu size={18} className="me-1" />
                  </Button>
                </div>
              </div>
            </Col>
            <Offcanvas
              show={showSidebar}
              onHide={() => setShowSidebar(false)}
              placement="start"
              className="d-lg-none"
              style={{ width: "280px" }}
            >
              <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="p-0">
                <UserSidebar
                  user={user}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </Offcanvas.Body>
            </Offcanvas>

            <Col lg={9} xl={10}>
              <div className="profilePage__mainContent">
                {renderTabContent()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <LogoutModal
        showLogoutModal={showLogoutModal}
        onHide={handleCloseLogout}
      />
    </>
  );
};

export default ProfilePage;
