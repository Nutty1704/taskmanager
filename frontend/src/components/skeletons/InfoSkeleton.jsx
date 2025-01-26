import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const InfoSkeleton = () => {
  return (
    <div className='flex items-center gap-x-4'>
      <div className='w-[60px] h-[60px] relative'>
        <Skeleton className='w-full h-full absolute' />
      </div>
      <div>
        <Skeleton className='h-10 w-[200px]' />
      </div>
    </div>
  )
}

export default InfoSkeleton
