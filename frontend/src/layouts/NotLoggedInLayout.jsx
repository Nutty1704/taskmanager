import React from 'react'
import Navbar from '../components/ui/Navbar'
import { AuthControl } from '../components/security/AuthControl'

const NotLoggedInLayout = ({ children }) => {
  return (
    <>
        <AuthControl />
        <Navbar />
        <main className='min-h-screen flex'>
          {children}
        </main>
    </>
  )
}

export default NotLoggedInLayout
