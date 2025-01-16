import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='fixed top-0 w-full h-14 flex items-center p-4 py-2 border-b-2 border-secondary shadow-sm'>
        <div className='mx-auto flex items-center w-full justify-between md:max-w-screen-2xl'>
          <Logo />
          <div id="nav-links" className='poppins-regular font-medium space-x-4 md:block md:w-auto flex items-center justify-between w-full'>
              <Button variant="outline">
                <Link className='poppins-medium font-medium flex items-center justify-center gap-2' to='/login'>
                  <LogIn size='20' />
                  Login
                </Link>
              </Button>
          </div>
        </div>
    </div>
  )
}

export default Navbar
