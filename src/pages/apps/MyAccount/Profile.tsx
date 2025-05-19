import React from "react";
import OrganizationDetails from "../Organizations/OrganizationDetails";
import KitchensDetails from "../kitchen/KitchensDetails";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

function Profile() {
  const { context } = useAuthDetails();
  return (
    <div>
      {context?.contextType === "Organization" ? (
        <OrganizationDetails />
      ) : context?.contextType === "Kitchen" ? (
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
