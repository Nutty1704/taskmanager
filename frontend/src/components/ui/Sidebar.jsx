import React from 'react'

// Custom Component imports
import NavItem from './NavItem'

import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { useOrganizationList, useOrganization } from '@clerk/clerk-react'

// Shadcn Component imports
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Accordion } from '@/components/ui/accordion'
import SidebarSkeleton from '../skeletons/SidebarSkeleton'

const Sidebar = ({ stateKey = 'org-sidebar-state' }) => {
    const [expanded, setExpanded] = useLocalStorage(stateKey, {});
    const {
        organization: activeOrganization,
        isLoaded: isLoadedOrg
    } = useOrganization();

    const {
        userMemberships,
        isLoaded: isLoadedOrgList
    } = useOrganizationList({
        userMemberships: {
            infinite: true,
        }
    });

    const defaultAccordionValue = Object.keys(expanded)
        .reduce((acc, key) => {
            if (expanded[key]) {
                acc.push(key);
            }

            return acc;
        }, []);

    const onExpand = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    };

    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <SidebarSkeleton />
        )
    }

    return (
        <>
            <div className='poppins-medium text-xs flex items-center mb-1'>
                <span className='pl-4'>
                    Workspaces
                </span>
                <Button
                    asChild
                    type='button'
                    size='icon'
                    variant='ghost'
                    className='ml-auto'
                >
                    <Link to='/select-org'>
                        <Plus className='h-4 w-4' />
                    </Link>
                </Button>
            </div>
            <Accordion
                type='multiple'
                defaultValue={defaultAccordionValue}
                className='space-y-2'
            >
                {userMemberships.data.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrganization?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    )
}

export default Sidebar
