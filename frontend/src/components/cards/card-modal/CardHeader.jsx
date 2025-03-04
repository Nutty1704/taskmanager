import { LayoutIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../form/form-input'
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSchema } from '@/src/lib/form-validators';
import toast from 'react-hot-toast';
import { useCardModal } from '@/src/hooks/useCardModal';
import { useEventListener } from 'usehooks-ts';
import { useQueryClient } from '@tanstack/react-query';
import CardComplete from './actions/complete/CardComplete';
import useCardAPI from '@/src/hooks/api/useCardAPI';

const Header = ({ data }) => {
    const [ title, setTitle ] = useState(data.title);
    const { boardId } = useParams();
    const formRef = useRef(null);
    const { isOpen } = useCardModal();
    const { updateCard } = useCardAPI();
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({
      resolver: zodResolver(cardSchema.pick({ title: true })),
      defaultValues: {
        title: data.title
      }
    });
    const queryClient = useQueryClient();

    useEffect(() => {
      // if (!isOpen) reset();
    }, [isOpen]);

    const onBlur = () => {
      formRef.current?.requestSubmit();
    }

    const onSubmit = async (formData) => {
      try {
        if (title === formData.title) return;

        formData.boardId = boardId;
        formData.listId = data.list_id;
        formData.cardId = data._id;

        const { success } = await updateCard(formData);

        if (!success) {
          toast.error('Failed to update card');
        } else {
          data.title = formData.title;
          toast.success('Card renamed');
          queryClient.invalidateQueries(['card-logs', data._id]);
        }

      } catch (error) {
        console.log(error);
      }
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        reset();
      } else if (e.key === 'Enter') {
        formRef.current?.requestSubmit();
      }
    }

    useEventListener('keydown', onKeyDown);

  return (
    <div className='flex items-start gap-x-3 w-full'>
      {/* <LayoutIcon size={17} className='mt-1 text-foreground' /> */}
      <div className='mt-1.5'>
        <CardComplete data={data} boardId={boardId} />
      </div>
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
                  className='font-semibold text-xl md:text-xl px-1 text-foreground bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-background focus-visible:border-input mb-0.5 truncate'
              />
            <button hidden type='submit'>Submit</button>
        </form>

        <p className='text-sm text-muted-foreground font-normal'>
          in list <span className='underline'>{data.list?.title}</span>
        </p>
      </div>

      {/* Hidden input to avoid focusing on the form */}
      <input hidden type='text' autoFocus />
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
