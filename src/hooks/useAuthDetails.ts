import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getContext } from "../helpers/api/utils";


export interface Context {
  contextId: string |number;
  contextType: "Organization" | "Kitchen";
  slug: string;
  roleId: string;
}

export const useAuthDetails = () => {
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );

  const context = getContext();

  const isContext = !!context;
  const isSuperAdmin = userLoggedIn && user?.role === "Admin" && !context;

  return {
    loading,
    user: userLoggedIn && user ? user : null,
    context,
    isContext,
    isSuperAdmin,
  };
};
 