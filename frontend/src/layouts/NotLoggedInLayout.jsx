import React from 'react'
import Navbar from '../components/ui/Navbar'

const NotLoggedInLayout = ({ children }) => {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default NotLoggedInLayout
