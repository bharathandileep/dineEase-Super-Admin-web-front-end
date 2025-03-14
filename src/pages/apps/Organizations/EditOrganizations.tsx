import React from "react";
import { WizardForm } from "./Form/WizardForm";
 
function EditOrganizations() {
  const isEditing = true;
  return (
    <div>
      <WizardForm initialData={isEditing} />
    </div>
  );
}
 
export default EditOrganizations;
