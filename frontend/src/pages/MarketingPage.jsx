import CtaButton from '@/src/components/ui/CtaButton'
import React, { useEffect } from 'react'
import Footer from '../components/ui/Footer'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const MarketingPage = () => {

  return (
    <>
      <main className='pt-40 pb-20'>
        <div className='flex items-center justify-center flex-col'>
          <div className="flex items-center justify-center flex-col gap-10">
            <div className='bg-secondary/90 cursor-pointer hover:bg-secondary/60 px-4 py-1 rounded-full'>
              <p className='text-primary brightness-90 poppins-medium font-medium'>Introducing Donezo</p>
            </div>

            <h1 className='poppins-semibold text-center font-heading text-4xl sm:text-5xl lg:text-6xl text-balance font-bold max-w-screen-2xl'>The ultimate platform to help achieve <span className=' bg-clip-text text-transparent bg-logo-gradient brightness-95'>Your Team's Goals</span></h1>

            <p className='poppins-regular max-w-3xl text-center text-lg text-muted-foreground sm:text-xl'>Unleash the potential of streamlined workflows and intelligent task recommendations for effortless project management.</p>

            <CtaButton text="Get Started" link="/signup" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default MarketingPage
