import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import CardLabelList from './CardLabelList'
import { ArrowLeft, X } from 'lucide-react'
import CardLabelSearch from './CardLabelSearch'
import CardLabelForm from './form/CardLabelForm'
import { useParams } from 'react-router-dom'
import { deleteBoardLabel, updateBoardLabel } from '@/src/lib/api/board'
import toast from 'react-hot-toast'
import useLabelStore from '@/src/stores/useLabelStore'
import { useQueryClient } from '@tanstack/react-query'
import useCardStore from '@/src/stores/useCardStore'


const CardLabelPopoverTitle = ({ text, showForm, setShowForm }) => {
  return (
    <div className='w-full p-1 flex items-center mb-3 relative'>
      {showForm && (
        <ArrowLeft
          className='h-4 w-4 absolute top-1 cursor-pointer'
          onClick={() => setShowForm(false)}
        />
      )}

      <span className='w-full text-sm text-center font-semibold text-muted-foreground'>{text}</span>

      <PopoverClose className='absolute top-1 right-1'>
        <X className='w-4 h-4' />
      </PopoverClose>
    </div>
  )
}

const CardLabelPopover = ({ children, card }) => {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState({});
  const { boardId } = useParams();
  const { addLabel, deleteLabel, updateLabel } = useLabelStore();
  const { removeLabelFromAllCards: removeLabel } = useCardStore();

  const onShowForm = (initialData, isUpdate = false) => {
    setShowForm(true);
    setFormInitialData({ ...initialData, isUpdate });
  }

  const onSave = async (title, color, id = '') => {
    try {
      const { success, newLabel } = await updateBoardLabel(boardId, id, title, color);

      if (!success) {
        toast.error('Failed to save label');
      } else {
        console.log(newLabel);
        if (id) updateLabel(newLabel);
        else addLabel(newLabel);
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onDelete = async (id) => {
    try {
      const { success } = await deleteBoardLabel(boardId, id);

      if (!success) {
        toast.error('Failed to delete label');
      } else {
        deleteLabel(id);
        setShowForm(false);
        removeLabel(id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getPopoverContent = () => {
    if (!showForm) {
      return (
        <>
          <CardLabelPopoverTitle text='Labels' showForm={showForm} setShowForm={setShowForm} />

          <CardLabelSearch setLabels={setSelectedLabels} />

          <div className="mt-3">
            <CardLabelList card={card} labels={selectedLabels} onShowForm={onShowForm} />
          </div>
        </>
      )
    }

    return (
      <>
        <CardLabelPopoverTitle
          text={formInitialData.isUpdate ? 'Edit Label' : 'Create Label'}
          showForm={showForm}
          setShowForm={setShowForm}
        />

        <CardLabelForm label={formInitialData} onSave={onSave} onDelete={onDelete} />
      </>
    )
  }

  const onOpenChange = (open) => {
    if (open) return;

    setShowForm(false);
    setFormInitialData({});
  }

  return (
    <Popover
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger
        className='w-full'
      >
        {children}
      </PopoverTrigger>

      <PopoverContent
        side='left'
        align='end'
        className='min-w-[300px] poppins-regular'
      >
        {getPopoverContent()}
      </PopoverContent>
    </Popover>
  )
}

export default CardLabelPopover
