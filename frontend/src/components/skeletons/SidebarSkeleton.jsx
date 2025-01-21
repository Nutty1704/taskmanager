import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import NavItemSkeleton from './NavItemSkeleton'

const SidebarSkeleton = () => {
    return (
        <>
            <div className='flex items-center gap-x-4 justify-between mb-2'>
                <Skeleton className='h-10 w-1/2' />
                <Skeleton className='h-10 w-10' />
            </div>
            <div className='space-y-2'>
                <NavItemSkeleton />
                <NavItemSkeleton />
                <NavItemSkeleton />
            </div>
        </>
    )
}

export default SidebarSkeleton
