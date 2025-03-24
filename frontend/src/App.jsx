import './App.css'

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

import { useAuth } from '@clerk/clerk-react';
import BoardLayout from './layouts/BoardLayout'
import BoardPage from './pages/BoardPage'
import NotFoundPage from './pages/404'
import { ping } from './lib/socket'
import CheckpointPage from './pages/CheckpointPage'
import CheckpointLayout from './layouts/CheckpointLayout'

const App = () => {
  const { userId, orgId } = useAuth();

  useEffect(() => {
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster
        position='bottom-right'
        reverseOrder={false}
        gutter={3}
        toastOptions={{
          duration: 3000,
          className: "p-4 rounded-lg shadow-lg text-sm border bg-background text-foreground poppins-regular",
          success: {
            iconTheme: {
              primary: "hsl(var(--success))",
              secondary: "hsl(var(--background))",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(var(--destructive))",
              secondary: "hsl(var(--background))",
            },
          },
        }}
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

        <Route path='/checkpoint/:checkpointId' element={
          <ProtectedRoute>
            <CheckpointLayout>
              <CheckpointPage />
            </CheckpointLayout>
          </ProtectedRoute>
        } />

        <Route path='*' element={
          <NotLoggedInLayout>
            <NotFoundPage />
          </NotLoggedInLayout>
        } />
        
      </Routes>
    </>
  )
}

export default App
