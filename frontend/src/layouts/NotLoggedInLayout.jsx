import React from 'react'
import Navbar from '../components/ui/Navbar'

const NotLoggedInLayout = ({ children }) => {
  return (
    <>
        <Navbar />
        <main className='min-h-screen flex'>
          {children}
        </main>
    </>
  )
}

export default NotLoggedInLayout
