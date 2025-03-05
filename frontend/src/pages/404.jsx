import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <main className='flex flex-col items-center justify-center h-[90vh] w-full gap-6'>
            <h1 className='text-4xl poppins-semibold'>404 - Not Found</h1>
            <Button
                onClick={handleGoHome}
                variant='outline'
                size='lg'
            >
                Go to Home
            </Button>
        </main>
    );
};

export default NotFoundPage;
