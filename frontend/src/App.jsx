import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MarketingPage from './pages/MarketingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import SelectOrgPage from './pages/SelectOrgPage'

import ProtectedRoute from './components/security/ProtectedRoute'
import { metadata } from '@/src/config/site'
import { Helmet } from 'react-helmet'
import OrganizationPage from './pages/OrganizationPage'
import DashboardLayout from './layouts/DashboardLayout'
import NotLoggedInLayout from './layouts/NotLoggedInLayout'
import { Toaster } from 'react-hot-toast'

import { useSession } from '@clerk/clerk-react';
import useAuthStore from './stores/useAuthStore'

const App = () => {
  const { session } = useSession();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const fetchAndSetToken = async () => {
      if (session) {
        const token = await session.getToken();
        setToken(token);
      }
    };

    fetchAndSetToken();
  }, [session, setToken]);

  return (
    <div>
      <Toaster
        position='bottom-right'
        reverseOrder={false}
      />

      <Helmet>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
        <meta name='keywords' content={metadata.keywords} />
      </Helmet>


      <Routes>
        <Route path='/' element={
          <NotLoggedInLayout>
            <MarketingPage />
          </NotLoggedInLayout>
        } />
        <Route path='/login' element={
          <NotLoggedInLayout>
            <LoginPage />
          </NotLoggedInLayout>
        } />
        <Route path='/signup' element={
          <NotLoggedInLayout>
            <SignUpPage />
          </NotLoggedInLayout>
        } />
        <Route path='/select-org' element={
          <ProtectedRoute>
            <SelectOrgPage />
          </ProtectedRoute>
        } />
        <Route path='/organization/:orgId/:page?' element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrganizationPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
