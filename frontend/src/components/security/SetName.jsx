import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ToolTip from '../ui/ToolTip';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import FormInput from '../form/form-input';
import FormSubmit from '../form/form-submit';

const SetName = ({ open, onClose }) => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    }
  });

  useEffect(() => {
    if (isLoaded && user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
    }
  }, [isLoaded, user, setValue]);

  const onSubmit = async (data) => {
    const { firstName, lastName } = data;
    const name = `${firstName.trim()} ${lastName.trim()}`;

    if (!firstName.trim() || !lastName.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      await user.update({ firstName, lastName });
      onClose();
    } catch (err) {
      setError('Failed to update name. Please try again.');
      console.log("Error updating name", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="w-full flex items-center gap-x-2">
            <DialogTitle>Set Your Name</DialogTitle>
            <ToolTip
              side="top"
              align="start"
              text={"Setting a name is required to proceed. You can change it later in your profile."}
              textClassName="text-warning"
            >
              <Info className="h-3 w-3 text-warning" />
            </ToolTip>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-2.5'>
          <div className='flex items-center w-full gap-3'>

            <FormInput
              id="firstName"
              type="text"
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              placeholder="Enter your first name"
              isSubmitting={loading}
              errors={errors.firstName}
              className='basis-1/2'
            />

            <FormInput
              id="lastName"
              type="text"
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              placeholder="Enter your last name"
              isSubmitting={loading}
              errors={errors.lastName}
              className='basis-1/2'
            />
          </div>

          {error && (
            <div className='text-destructive text-xs font-semibold'>
              {error}
            </div>
          )}

          <DialogFooter className='flex sm:justify-start flex-col sm:items-start'>
            <FormSubmit isSubmitting={loading}>
                Save
            </FormSubmit>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetName;
