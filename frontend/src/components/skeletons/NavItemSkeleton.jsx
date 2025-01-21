import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const NavItemSkeleton = () => {
  return (
    <div className='flex items-center gap-x-2'>
        <div className='w-10 h-10 relative shrink-0'>
            <Skeleton className='h-full w-full absolute' />
        </div>

        <Skeleton className='h-10 w-full' />
    </div>
  )
}

export default NavItemSkeleton
