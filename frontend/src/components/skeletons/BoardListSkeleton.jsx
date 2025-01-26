import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const BoardListSkeleton = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className='aspect-video bg-accent/50 h-full w-full p-2' />
        ))}
    </div>
  )
}

export default BoardListSkeleton
