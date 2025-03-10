import React from "react";

// import PerformanceChart from "./PerformanceChart";
// import RevenueChart from "./RevenueChart";

// dummy data
import { chatMessages } from "./data";
import Statistics from "../../apps/Restaurant/List/Statistics";
import PageTitle from "../../../components/PageTitle";
import { Col, Row } from "react-bootstrap";

const Dashboard3 = () => { 
  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Dashboards", path: "/dashboard" },
          { label: "Dashboard", path: "/dashboard", active: true },
        ]}
        title={"Dashboard"}
      />

      {/* <Statistics /> */}

      <Row>
        <Col xl={6}>
          {/* <RevenueChart /> */}
        </Col>
        <Col xl={6}>
          {/* <PerformanceChart /> */}
        </Col>
      </Row>
      <Row>
        <Col lg={6} xl={4}>
          {/* <Messages /> */}
        </Col>
        <Col lg={6} xl={4}>
          {/* <TodoList addTodo={true} height={"310px"} /> */}
        </Col>
        <Col lg={12} xl={4}>
          {/* <ChatList messages={chatMessages} /> */}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard3;
