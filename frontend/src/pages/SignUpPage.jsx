import { SignUp } from '@clerk/clerk-react'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='mt-10 flex items-center justify-center w-full'>
        <SignUp fallbackRedirectUrl='/' signInUrl='/login' />
    </div>
  )
}

export default SignUpPage
