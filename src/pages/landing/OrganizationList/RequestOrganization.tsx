import React from 'react'
import { WizardForm } from '../../apps/Organizations/Form/WizardForm'
import DashboardNavbar from '../Dashboard/DashboardNavbar'

function RequestOrganization() {
  return (
    <div className="bg-white"> 
     <DashboardNavbar/>
      <WizardForm/>
    </div>
  )
}

export default RequestOrganization
