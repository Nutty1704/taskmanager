import { ChevronDown, ChevronUp } from 'lucide-react';
import BoardListGrid from '../boards/BoardListGrid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const CollapsibleBoardList = ({ title, icon: Icon, boards }) => {
    if (boards.length === 0) return null;
    const [show, setShow] = useState(true);

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between font-semibold text-lg'>
                <div className='flex items-center'>
                    <Icon className='h-6 w-6 mr-2' />
                    {title}
                </div>
                <Button size='sm' variant='transparent' onClick={() => setShow(!show)}>
                    {show ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                </Button>
            </div>

            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out 
                    ${show ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <BoardListGrid boards={boards} showCreateBoardForm={false} />
            </div>
        </div>
    );
};

export default CollapsibleBoardList;
