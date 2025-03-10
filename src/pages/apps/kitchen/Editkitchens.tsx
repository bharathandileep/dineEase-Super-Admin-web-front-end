import React, { useEffect, useState } from "react";
import { WizardForm } from "./Form/WizardForm";
import { IKitchenDetails } from "./KitchensDetails";
import { useNavigate, useParams } from "react-router-dom";
import { getkitchenDetails } from "../../../server/admin/kitchens";

function Editkitchens() {
  const isEditing = true;

  return (
    <div>
      <WizardForm initialData={isEditing} />
    </div>
  );
}
export default Editkitchens;
