import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

import { useAuth, useSession } from '@clerk/clerk-react';
import useAuthStore from './stores/useAuthStore'
import BoardLayout from './layouts/BoardLayout'
import BoardPage from './pages/BoardPage'

const App = () => {
  const { session } = useSession();
  const { token, setToken } = useAuthStore();
  const { userId, orgId } = useAuth();

  useEffect(() => {
    const fetchAndSetToken = async () => {
      if (session) {
        const sessionToken = await session.getToken();
        if (sessionToken === token) return;

        setToken(sessionToken);
      }
    };

    fetchAndSetToken();
  }, [session, setToken]);

  return (
    <>
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
          userId
            ? orgId
              ? <Navigate to={`/organization/${orgId}`} />
              : <Navigate to={`/select-org`} />
            : (
              <NotLoggedInLayout>
                <MarketingPage />
              </NotLoggedInLayout>
            )
        } />

        <Route path='/login' element={
          userId
            ? <Navigate to='/' />
            : (
              <NotLoggedInLayout>
                <LoginPage />
              </NotLoggedInLayout>
            )
        } />

        <Route path='/signup' element={
          userId
            ? <Navigate to='/' />
            : (
              <NotLoggedInLayout>
                <SignUpPage />
              </NotLoggedInLayout>
            )
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

        <Route path='/board/:boardId' element={
          <ProtectedRoute>
            <BoardLayout>
              <BoardPage />
            </BoardLayout>
          </ProtectedRoute>
        } />
        
      </Routes>
    </>
  )
}

export default App
