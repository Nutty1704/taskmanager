import React, { useEffect, useState } from 'react'
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { OrgControl } from '../components/security/OrgControl';
import { startCase } from 'lodash';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet';
import SetName from '../components/security/SetName';

const DashboardLayout = ({ children }) => {
  const { orgSlug, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [ showModal, setShowModal ] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !user?.fullName) {
      setShowModal(true);
    }
  }, [user, isLoaded, isSignedIn]);

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
      
      <SetName onClose={() => setShowModal(false)} open={showModal} />
    </>
  )
}

export default DashboardLayout;
