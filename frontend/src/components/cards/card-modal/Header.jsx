import { LayoutIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import FormInput from '../../form/form-input'
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSchema } from '@/src/lib/form-validators';
import { updateCard } from '@/src/lib/api/card';
import toast from 'react-hot-toast';

const Header = ({ data }) => {
    const queryClient = useQueryClient();
    const { boardId } = useParams();
    const formRef = useRef(null);
    const [ title, setTitle ] = useState(data.title);
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
      resolver: zodResolver(cardSchema.pick({ title: true })),
      defaultValues: {
        title: data.title
      }
    });
    
    React.useEffect(() => {
      console.log('data', data);
    }, [data]);

    const onBlur = () => {
      formRef.current?.requestSubmit();
    }

    const onSubmit = async (formData) => {
      try {
        formData.boardId = boardId;
        formData.listId = data.list_id;
        formData.cardId = data._id;

        const { success } = await updateCard(formData);

        if (!success) {
          toast.error('Failed to update card');
        } else {
          toast.success('Card renamed');
        }

      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className='flex items-start gap-x-3 mb-6 w-full'>
      <LayoutIcon size={17} className='mt-1 text-muted-foreground' />
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <FormInput
                {...register('title')}
                id='title'
                name='title'
                defaultValue={title}
                placeholder='Enter card title...'
                onBlur={onBlur}
                errors={errors.title}
                isSubmitting={isSubmitting}
                className='font-semibold text-xl md:text-xl px-1 text-muted-foreground bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-background focus-visible:border-input mb-0.5 truncate'
            />
            <button hidden type='submit'>Submit</button>
        </form>

        <p className='text-sm'>
          in list <span className='underline'>{data.list?.title}</span>
        </p>
      </div>
    </div>
  )
}


Header.Skeleton = () => (
  <div className="flex items-start gap-x-3 mb-6">
    <Skeleton className='h-6 w-6 mt-1 bg-secondary' />
    <div>
      <Skeleton className='w-24 h-6 mb-1 bg-secondary' />
      <Skeleton className='w-12 h-4 bg-secondary' />
    </div>
  </div>
)

export default Header
