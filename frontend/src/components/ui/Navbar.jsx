import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { LogIn, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ModeToggle } from '../theme/mode-toggle'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <nav className='fixed top-0 w-full h-14 flex items-center p-4 py-2 border-b-2 border-secondary shadow-sm'>
      <div className='mx-auto flex items-center justify-between w-full max-w-screen-2xl'>
        <Logo />
        <div id="nav-links" className='flex items-center justify-center gap-4 md:justify-end w-full'>
          <ModeToggle />
          <Button variant="outline">
            <SignedOut>
              <Link className='poppins-medium font-medium flex items-center justify-center gap-2' to='/login'>
                <LogIn size='20' />
                Login
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              >
                {/* <UserButton.MenuItems>
                  <UserButton.Link label='Your Boards' />
                </UserButton.MenuItems> */}
              </UserButton>
            </SignedIn>
          </Button>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
