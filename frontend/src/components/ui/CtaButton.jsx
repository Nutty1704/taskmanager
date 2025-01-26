import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CtaButton = ({ text, link }) => {
    return (
        <Link to={link} className='poppins-medium'>
            <Button
                size="lg"
                asChild={false}
                className="flex flex-row cursor-pointer sm:h-14 sm:text-base sm:px-10 gap-2 bg-logo-gradient hover:scale-95 hover:opacity-90 transition-transform group w-full text-neutral-800 rounded-md" 
            >
                {text}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Button>
        </Link>
    )
}

export default CtaButton
