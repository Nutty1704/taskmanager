import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { features } from '@/src/data/marketing'
import React from 'react'
import MarketingCard from './MarketingCard'
import Autoplay from "embla-carousel-autoplay"
import { ArrowLeft, ArrowRight } from 'lucide-react'

const Features = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 2500, stopOnInteraction: false })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full relative group max-w-screen-xl mx-auto"
            opts={{
                align: "start",
                slidesToScroll: 1,
                loop: true,
                dragFree: true
            }}
        >
            <CarouselContent className="flex items-center justify-start w-full space-x-6 max-w-screen-xl mx-auto">
                {features.map((feature) => (
                    <CarouselItem key={feature.id} className="flex-shrink-0 w-full">
                        <MarketingCard title={feature.title} description={feature.description} url={feature.url} />
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious
                className="absolute hidden top-1/2 left-4 transform -translate-y-1/2 z-20 text-foreground text-2xl sm:left-6 lg:left-8 group-hover:flex items-center justify-center"
            >
                <ArrowLeft className='h-2 w-2' />
            </CarouselPrevious>

            <CarouselNext
                className="absolute hidden top-1/2 right-4 transform -translate-y-1/2 z-20 text-foreground text-2xl sm:right-6 lg:right-8 group-hover:flex items-center justify-center"
            >
                <ArrowRight className='h-2 w-2' />
            </CarouselNext>
        </Carousel>


    )
}

export default Features;
