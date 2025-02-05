import React, { useState } from 'react'
import colors from '@/src/config/labelColors.json'
import ToolTip from '@/src/components/ui/ToolTip';

const CardUHLabelListItem = ({ label, small = false }) => {
  if (!label) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const widthOptions = getWidthOptions(small, isExpanded);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  }
  

  return (
    <ToolTip text={`Color: ${colors[label.color].name}, title: ${label.title}`}>
      <div
        className={`h-${small ? '2' : '4'} rounded-${small ? 'lg' : 'md'} ${isExpanded && (small ? 'p-2' : 'p-3')} flex items-center justify-center cursor-pointer transition-all duration-300`}
        style={{
          backgroundColor: colors[label.color].hex,
          width: widthOptions.width,
          maxWidth: widthOptions.maxWidth,
          minWidth: widthOptions.minWidth,
          overflow: 'hidden',
          whiteSpace: 'nowrap', // Prevents title wrapping
        }}
        onClick={handleClick}
      >
        {isExpanded && (
          <span className='text-sm poppins-medium text-primary-foreground'>{label.title}</span>
        )}
      </div>
    </ToolTip>
  )
}

const getWidthOptions = (small, isExpanded) => {
  const widthOptions = {
    width: isExpanded 
      ? 'auto' 
      : small 
        ? '0.5rem' 
        : '1.5rem', // Dynamic width based on `isExpanded` and `small`
    maxWidth: isExpanded 
      ? '100%' 
      : small 
        ? '1rem' 
        : '1.5rem', // Max width depending on `isExpanded` and `small`
    minWidth: isExpanded 
      ? (small ? '3rem' : '4rem') 
      : (small ? '1rem' : '1.5rem'), // Min width based on `isExpanded` and `small`
  };
  return widthOptions
}

export default CardUHLabelListItem
