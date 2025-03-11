import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '@/src/animations/fade-in';
import useIsMobileView from '@/src/hooks/useIsMobileView';

const MarketingCard = ({ title, description, url }) => {
  const isMobileView = useIsMobileView(760);

  return (
    <FadeIn threshold={0.1}>
      <motion.div
        className="relative flex group min-h-[300px] lg:min-h-[350px] rounded-lg overflow-hidden"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.3 },
        }}
      >
        {/* Left side for Text Content */}
        <motion.div
          className={`flex flex-col items-start p-6 relative ${isMobileView ? 'justify-end w-full' : 'justify-center w-2/3'}`}
          initial={{ x: 0 }}
          whileHover={{ x: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3 className={`text-lg md:text-xl xl:text-2xl font-bold z-20 ${isMobileView ? 'text-white' : 'text-foreground'}`}>
            {title}
          </h3>
          <p className={`text-sm md:text-base xl:text-md text-left z-20 ${isMobileView ? 'text-white' : 'text-muted-foreground'}`}>
            {description}
          </p>
          {/* Gradient overlay */}
          {isMobileView
          ? <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10'></div>
          : <div className="absolute inset-0 bg-gradient-to-r from-muted to-transparent opacity-70"></div>}
        </motion.div>

        {/* Right side for Background Image */}
        <motion.div
          className={`absolute right-0 inset-y-0 bg-cover bg-center ${isMobileView ? 'w-full' : 'w-2/5'}`}
          style={{
            backgroundImage: `url(${url})`,
          }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </FadeIn>
  );
};

export default MarketingCard;
