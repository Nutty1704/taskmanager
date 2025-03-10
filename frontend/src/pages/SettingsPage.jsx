import React from 'react'
import { OrganizationProfile } from '@clerk/clerk-react'

const SettingsPage = () => {
  return (
    <div className='w-full mb-5'>
        <OrganizationProfile
            appearance={{
                elements: {
                    rootBox: 'shadow-none w-full',
                    card: 'border border-accent shadow-nnone w-full',
                    profileSectionPrimaryButton__organizationProfile: 'text-muted-foreground hover:text-foreground',
                    navbarButtonText: 'text-muted-foreground',
                    tabButton: 'text-muted-foreground hover:text-foreground aria-[selected=true]:text-foreground group aria-[selected=true]:border-b border-foreground',
                    notificationBadge: 'text-muted-foreground group-hover:text-foreground group-aria-[selected=true]:text-foreground',
                    menuButton__member: 'text-muted-foreground hover:text-foreground',
                    menuItem: 'data-[color=danger]:text-red-500',
                    selectButton__role: 'data-[color=primary]:border data-[color=primary]:border-muted-foreground/[0.3]',
                    tagInputContainer: 'bg-secondary',
                    input: 'text-foreground placeholder:text-muted-foreground',
                }
            }}
        />
    </div>
  )
}

export default SettingsPage
