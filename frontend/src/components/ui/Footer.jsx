import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'

const Footer = () => {
  return (
    <div className='fixed bottom-0 w-full p-4 py-2 border-t border-secondary text-xs'>
        <div className='mx-auto flex items-center w-full justify-between md:max-w-screen-2xl'>
          <div className='poppins-regular w-full justify-center font-medium flex flex-row gap-8'>
              <Button size='sm' variant='ghost'>
                Privacy Policy
              </Button>
              <Button size='sm' variant='ghost'>
                Terms of Service
              </Button>
          </div>
        </div>
    </div>
  )
}

export default Footer
