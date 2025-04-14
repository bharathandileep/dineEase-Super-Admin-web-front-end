import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APICore } from "../helpers/api/apiCore";
import { getAccessDetailsFromLocalStorage, getContext } from "../helpers/api/utils";

interface PrivateRouteProps {
  roles?: string[];
  children: ReactNode;
}
interface LoggedInUser {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const api = new APICore();
  const location = useLocation();
  
  const isAuthenticated = api.isUserAuthenticated();
  const user = getContext()
  const loggedInUser = api.getLoggedInUserInfo() as LoggedInUser | null;
  if (!loggedInUser) {
    return <Navigate to="/" />;
  } 

  if (roles && roles.length > 0) {
    if (
      !roles.some(
        (role) => role.toLowerCase() === loggedInUser?.role.toLowerCase()
      )
    ) {
      return <Navigate to={`/apps/${user?.slug}`} replace />;
    }
  }

  return <>{children}</>;
};
 
export default PrivateRoute;
