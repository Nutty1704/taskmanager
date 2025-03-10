import { SignUp } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../components/theme/theme-provider'
import { getTheme } from '@/src/lib/util';

const SignUpPage = () => {
  const { theme } = useTheme();
  const [ variables, setVariables ] = useState({});
  
  useEffect(() => {
    setVariables(getTheme());
  }, [theme]);
  return (
    <div className='mt-10 flex items-center justify-center w-full'>
        <SignUp
          fallbackRedirectUrl='/'
          signInUrl='/login'
          appearance={{
            layout: {
              socialButtonsPlacement: 'bottom',
            },
            elements: {
              providerIcon__github: theme === 'dark' && 'invert-svg',
              headerTitle: 'text-foreground',
              formFieldLabel: 'text-foreground',
              formFieldInputShowPasswordButton: 'group',
              formFieldInputShowPasswordIcon: 'text-muted-foreground group-hover:text-foreground',
            },
            variables: variables,
          }}
        />
    </div>
  )
}

export default SignUpPage
