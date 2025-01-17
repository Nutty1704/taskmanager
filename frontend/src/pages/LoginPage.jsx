import { SignIn } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import { getTheme } from '@/src/lib/util';
import { useTheme } from '@/src/components/theme/theme-provider';

const LoginPage = () => {
    const { theme } = useTheme();
    const [ variables, setVariables ] = useState({});

    useEffect(() => {
      setVariables(getTheme());
    }, [theme]);

  return (
    <div className="flex flex-1 items-center justify-center w-full">
      <SignIn
        fallbackRedirectUrl="/"
        signUpUrl="/signup"
        appearance={{
          layout: {
            socialButtonsPlacement: 'bottom',
          },
          variables: variables,
        }}
      />
    </div>
  );
};

export default LoginPage;

