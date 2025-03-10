import { useState, useEffect } from 'react';

const useIsMobileView = (breakpoint = 768) => {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < breakpoint);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        
        return () => window.removeEventListener('resize', checkMobileView);
    }, [breakpoint]);

    return isMobileView;
};

export default useIsMobileView;