import React from 'react'
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { OrgControl } from '../components/security/OrgControl';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <OrgControl />
      <div className='h-full'>
        <DashboardNavbar />
        <main className='pt-20 md:pt-24 '>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;
