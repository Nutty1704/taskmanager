import React, { Suspense } from 'react'
import Info from '../components/ui/Info'
import { Separator } from '@/components/ui/separator'
import BoardList from '../components/ui/BoardList'
import BoardListSkeleton from '../components/skeletons/BoardListSkeleton'

const BoardsPage = () => {

  return (
    <div className='w-full mb-20'>
        <Info />
        <Separator className='my-4 bg-accent/50 border rounded-xl' />
        <div className="px-2 md:px-4">
              <BoardList />
        </div>
    </div>
  )
}

export default BoardsPage
