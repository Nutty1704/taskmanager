import React from 'react'
import { OrganizationProfile } from '@clerk/clerk-react'

const SettingsPage = () => {
  return (
    <div className='w-full'>
        <OrganizationProfile
            appearance={{
                elements: {
                    rootBox: 'shadow-none w-full',
                    card: 'border border-accent shadow-nnone w-full'

                }
            }}
        />
    </div>
  )
}

export default SettingsPage
