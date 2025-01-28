import React from 'react'
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { OrgControl } from '../components/security/OrgControl';
import { startCase } from 'lodash';
import { useAuth } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet';

const DashboardLayout = ({ children }) => {
  const { orgSlug } = useAuth();

  return (
    <>
      <Helmet>
        <title>{`${startCase(orgSlug || 'organization')} | Donezo`}</title>
      </Helmet>
      
      <div>
        <OrgControl />
        <div className='h-full'>
          <DashboardNavbar />
          <main className='pt-20 md:pt-24 '>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout;
