import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <div id="id">
            <Link to="/" className='flex flex-row items-center space-x-1'>
                <img src="/logo.svg" alt="Donezo" className='h-12 w-12' />
                <h1 className='font-bold text-2xl'>Donezo</h1>
            </Link>
        </div>
    )
}

export default Logo
