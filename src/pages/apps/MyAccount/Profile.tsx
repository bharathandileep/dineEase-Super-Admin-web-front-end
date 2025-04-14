import React from "react";
import { getContext } from "../../../helpers/api/utils";
import OrganizationDetails from "../Organizations/OrganizationDetails";
import KitchensDetails from "../kitchen/KitchensDetails";

function Profile() {
  const authContextDetails = getContext();
  return (
    <div>
      {authContextDetails?.contextType === "Organization" ? (
        <OrganizationDetails />
      ) : authContextDetails?.contextType === "Kitchen" ? (
        <KitchensDetails />
      ) : (
        <div className="text-muted text-center py-5">
          <h5>Profile page not set up</h5>
          <p>Please contact your administrator or switch your context.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
