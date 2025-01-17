import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MarketingPage from './pages/MarketingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'

import { metadata } from '@/src/config/site'
import { Helmet } from 'react-helmet'

const App = () => {
  document.title = metadata.title

  return (
    <div>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
        <meta name='keywords' content={metadata.keywords} />  
      </Helmet>
      <Navbar />
      <main className='min-h-screen flex'>
        <Routes>
          <Route path='/' element={<MarketingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />  
    </div>
  )
}

export default App
