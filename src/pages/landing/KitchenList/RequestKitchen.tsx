import React from 'react'
import { WizardForm } from '../../apps/kitchen/Form/WizardForm'
import DashboardNavbar from '../Dashboard/DashboardNavbar'

function RequestKitchen() {
  return (
    <div className="bg-white"> 
     <DashboardNavbar/>
      <WizardForm/>
    </div>
  )
}

export default RequestKitchen
