import React from 'react'
import colors from '@/src/config/labelColors.json'
import ToolTip from '@/src/components/ui/ToolTip'
import { Check } from 'lucide-react'

const LabelColorGrid = ({ selectedColor, onSelect = () => {} }) => {
  return (
    <div className='grid grid-cols-5 gap-1'>
        {Object.values(colors).map((color, index) => (
            <ToolTip text={`${color.name}`} key={index}>
                <div className='relative'>
                    <div
                        onClick={() => onSelect(index + 1)}
                        style={{ backgroundColor: color.hex }}
                        className='w-full h-8 rounded-md cursor-pointer'
                    />

                    {selectedColor.hex === color.hex && (
                        <Check className='absolute inset-0 m-auto w-4 h-4 text-white' />
                    )}
                </div>
            </ToolTip>
        ))}
    </div>
  )
}

export default LabelColorGrid
