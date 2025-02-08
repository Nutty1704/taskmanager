import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { OrganizationSwitcher, UserButton } from '@clerk/clerk-react'
import MobileSidebar from './MobileSidebar'
import BoardFormPopover from '../form/create-board-form-popover'
import { dark } from '@clerk/themes'
import { ModeToggle } from '../theme/mode-toggle'

const DashboardNavbar = ({ className = ''}) => {
  return (
    <nav className={`fixed z-50 top-0 px-4 w-full h-12 border-b shadow-sm bg-background ${className}` }>
      <div className='flex justify-between h-full'>
        <div className="h-full flex items-center gap-x-4">
          <div className='hidden md:flex'>
            <Logo />
          </div>
          <MobileSidebar />
          <BoardFormPopover align='start' side='bottom' sideOffset={18}>
            <Button size='sm' className='rounded-sm hidden md:block h-auto py-1.5 px-2 bg-foreground text-background'>
              Create
            </Button>
          </BoardFormPopover>
          <BoardFormPopover>
            <Button size='sm' className='my-auto block md:hidden bg-foreground'>
              <Plus size={24} className='rounded-sm text-background bg-foreground' />
            </Button>
          </BoardFormPopover>
        </div>
        <div className='flex items-center gap-x-2'>
          <ModeToggle />

          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl={(organization) => `/organization/${organization.id}`}
            afterSelectOrganizationUrl={(organization) => `/organization/${organization.id}`}
            afterLeaveOrganizationUrl='/select-org'
            appearance={{
              baseTheme: dark,
              elements: {
                // avatarBox: 'h-6 w-6',
                organizationSwitcherTriggerIcon: 'text-foreground',
                organizationSwitcherPopoverActions: 'bg-background text-foreground',
                organizationSwitcherPopoverActionButton: 'text-foreground',
              },
            }}
          />

          <UserButton
            afterSignOutUrl='/'
          />
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
