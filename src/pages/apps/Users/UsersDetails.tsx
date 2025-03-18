import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Users } from "./data";
// import AddUsersModal from "./List/AddUsers";
import List from './List'
import { Company, fetchCompanyApi } from "../../../server/allApi";
interface UsersDetailsProps {
  usersInfo: Users[];
}

const UsersDetails: React.FC = () => {

 

  return (
   <>
   <List/>
   </>
  );
  
};

export default UsersDetails;
