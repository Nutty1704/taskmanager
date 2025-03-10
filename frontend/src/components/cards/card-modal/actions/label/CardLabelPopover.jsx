import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog'
import CardLabelList from './CardLabelList'
import { ArrowLeft, X } from 'lucide-react'
import CardLabelSearch from './CardLabelSearch'
import CardLabelForm from './form/CardLabelForm'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useBoardAPI from '@/src/hooks/api/useBoardAPI'
import useIsMobileView from '@/src/hooks/useIsMobileView' // Custom hook to detect screen size

const CardLabelPopoverTitle = ({ text, showForm, setShowForm, isPopover }) => (
  <div className='w-full p-1 flex items-center mb-3 relative'>
    {showForm && (
      <ArrowLeft className='h-4 w-4 absolute top-1 cursor-pointer' onClick={() => setShowForm(false)} />
    )}

    <span className='w-full text-sm text-center font-semibold text-muted-foreground'>{text}</span>

    {isPopover && (
      <PopoverClose className='absolute top-1 right-1'>
        <X className='w-4 h-4' />
      </PopoverClose>
    )}
  </div>
)

const CardLabelPopover = ({ children, card }) => {
  const [selectedLabels, setSelectedLabels] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formInitialData, setFormInitialData] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { boardId } = useParams()
  const { deleteBoardLabel, updateBoardLabel } = useBoardAPI()
  const isMobileView = useIsMobileView()

  const onShowForm = (initialData, isUpdate = false) => {
    setShowForm(true)
    setFormInitialData({ ...initialData, isUpdate })
  }

  const onSave = async (title, color, id = '') => {
    try {
      const { success } = await updateBoardLabel(boardId, id, title, color)
      if (!success) {
        toast.error('Failed to save label')
      } else {
        setShowForm(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onDelete = async (id) => {
    try {
      const { success } = await deleteBoardLabel(boardId, id)
      if (!success) {
        toast.error('Failed to delete label')
      } else {
        setShowForm(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getContent = (isPopover) => (
    <>
      <CardLabelPopoverTitle
        text={showForm ? (formInitialData.isUpdate ? 'Edit Label' : 'Create Label') : 'Labels'}
        showForm={showForm}
        setShowForm={setShowForm}
        isPopover={isPopover}
      />

      {!showForm ? (
        <>
          <CardLabelSearch setLabels={setSelectedLabels} />
          <div className="mt-3">
            <CardLabelList card={card} labels={selectedLabels} onShowForm={onShowForm} />
          </div>
        </>
      ) : (
        <CardLabelForm label={formInitialData} onSave={onSave} onDelete={onDelete} />
      )}
    </>
  )

  const onOpenChange = (open) => {
    if (!open) {
      setShowForm(false)
      setFormInitialData({})
      setIsDialogOpen(false)
    }
  }

  if (isMobileView) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <div onClick={() => setIsDialogOpen(true)}>{children}</div>
        </DialogTrigger>
        <DialogContent className='poppins-regular w-[90vw] sm:w-[70vw]'>{getContent(false)}</DialogContent>
      </Dialog>
    )
  }

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger className='w-full'>{children}</PopoverTrigger>
      <PopoverContent side='left' align='end' className='min-w-[300px] poppins-regular'>
        {getContent(true)}
      </PopoverContent>
    </Popover>
  )
}

export default CardLabelPopover
