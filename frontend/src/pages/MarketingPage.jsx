import React from 'react';
import { Separator } from '@/components/ui/separator';
import Footer from '../components/ui/Footer';
import CtaButton from '../components/ui/CtaButton';
import About from '../components/marketing/About';
import FadeIn from '../animations/fade-in';
import Features from '../components/marketing/Features';

const MarketingPage = () => {
    return (
        <main className='relative pt-10 md:pt-32 mx-auto max-w-7xl px-6 text-center mt-14 z-10'>
            <FadeIn className='flex flex-col items-center gap-8 min-h-[60vh] md:min-h-[40vh]'>
                <div className='bg-secondary/90 cursor-pointer hover:bg-secondary/60 px-4 py-1 rounded-full shadow-md'>
                    <p className='text-primary brightness-90 poppins-medium font-medium'>Introducing Donezo</p>
                </div>

                <h1 className='poppins-semibold font-heading text-4xl sm:text-5xl lg:text-6xl text-balance font-bold max-w-4xl leading-tight'>
                    The ultimate platform to help achieve <span className='text-logo-gradient'>Your Team's Goals</span>
                </h1>

                <p className='poppins-regular max-w-3xl text-lg text-muted-foreground sm:text-xl'>
                    Keep your projects on track with a minimal, clutter-free design that streamlines workflows and simplifies task management.
                </p>

                <CtaButton text="Get Started" link="/signup" />
            </FadeIn>

            <Separator className='my-16' />

            <section id='features' className='flex flex-col items-center gap-8'>
                <h2 className='text-4xl poppins-semibold'>A look into what <span className='text-logo-gradient'>Donezo</span> has to offer</h2>

                <FadeIn className='w-full'>
                    <Features />
                </FadeIn>
            </section>

            <About />

            <Footer />
        </main>
    );
};

export default MarketingPage;