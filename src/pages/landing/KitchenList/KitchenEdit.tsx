import React from 'react'
import { WizardForm } from '../../apps/kitchen/Form/WizardForm'
import DashboardNavbar from '../Dashboard/DashboardNavbar'

function KitchenEdit() {

     const isEditing = true;
   
     return (
       <div>
        <DashboardNavbar/>
         <WizardForm initialData={isEditing} />
       </div>
     );
}

export default KitchenEdit
