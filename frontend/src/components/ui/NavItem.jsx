import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'

import { Activity, Layout, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const NavItem = ({
    isExpanded,
    isActive,
    onExpand,
    organization,
}) => {
    const location = useLocation();
    const navigate = useNavigate();


    const onClick = (href) => {
        navigate(href);
    }

    const routes = [
        {
            label: 'Boards',
            icon: <Layout className='h-4 w-4 mr-2' />,
            href: `/organization/${organization.id}`
        },
        {
            label: 'Activity',
            icon: <Activity className='h-4 w-4 mr-2' />,
            href: `/organization/${organization.id}/activity`
        },
        {
            label: 'Settings',
            icon: <Settings className='h-4 w-4 mr-2' />,
            href: `/organization/${organization.id}/settings`
        },
    ]

  return (
    <AccordionItem
        value={organization.id}
        className='border-none'
    >
        <AccordionTrigger
            onClick={() => onExpand(organization.id)}
            className={`flex items-center gap-x-2 p-1.5 text-foreground rounded-md hover:bg-primary/30 transition text-start no-underline hover:no-underline ${
                isActive && !isExpanded && "bg-accent/60"
            }`}
        >
            <div className='flex items-center gap-x-2'>
                <div className='w-7 h-7 relative'>
                    <img
                        src={organization.imageUrl}
                        alt={organization.name}
                        className='rounded-sm object-cover'
                    />
                </div>
                <span className='font-medium text-sm'>
                    {organization.name}
                </span>
            </div>
        </AccordionTrigger>

        <AccordionContent className='pt-1'>
            {routes.map((route) => (
                <Button
                    key={route.href}
                    size='sm'
                    onClick={() => onClick(route.href)}
                    className={`w-full flex items-center poppins-regular justify-start pl-10 mb-1 hover:bg-primary/30 ${
                        location.pathname === route.href && 'bg-accent/60'
                    }`}
                    variant='ghost'
                >
                    {route.icon}
                    {route.label}
                </Button>
            ))}
        </AccordionContent>
      
    </AccordionItem>
  )
}

export default NavItem

