import React from "react";

// components
import PageTitle from "../../../components/PageTitle";

// import UsersDetails from "./List/AddUsers";
import { usersInfo } from "./data";


const Users = () => {
  return (
    <>
      <PageTitle
        breadCrumbItems={[
          // { label: "Apps", path: "/apps/users" },
          // { label: "Users", path: "/apps/users", active: true },
        ]}
        title={"Users"}
      />
      {/* <ListUsers /> */}
    </>
  );
};

export default Users;
