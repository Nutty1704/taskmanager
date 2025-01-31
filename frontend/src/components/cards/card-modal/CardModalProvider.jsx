import React, { useEffect, useState } from 'react'
import CardModal from './CardModal';

const CardModalProvider = () => {
    // REMOVE?
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    // END REMOVE?

  return (
    <>
      <CardModal />
    </>
  )
}

export default CardModalProvider
