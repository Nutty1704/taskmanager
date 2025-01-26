import React from 'react'
import Sidebar from '../components/ui/Sidebar'
import { useParams } from 'react-router-dom'
import SettingsPage from './SettingsPage';
import BoardsPage from './BoardsPage';

const OrganizationPage = () => {
  const { orgId, page } = useParams();


  const getPage = () => {
    switch (page) {
      case undefined:
        return <BoardsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return 'Not Found'
    }
  }

  return (
    <div className='font-extrabold text-xl max-w-6xl 2xl:max-w-screen-xl mx-auto'>
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          {/* Sidebar */}
          <Sidebar />
        </div>
        {
          getPage()
        }
      </div>
    </div>
  )
}

export default OrganizationPage
