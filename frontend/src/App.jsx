import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MarketingPage from './pages/MarketingPage'
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
      <Routes>
        <Route path='/' element={<MarketingPage />} />
      </Routes>
      <Footer />  
    </div>
  )
}

export default App
