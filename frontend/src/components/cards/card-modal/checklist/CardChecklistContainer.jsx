import React from 'react'
import CardChecklist from './CardChecklist'

const CardChecklistContainer = ({ checklists, ...props }) => {
  if (!checklists) return null;

  return (
    <>
      {checklists.map(checklist => (
        <CardChecklist key={checklist._id} checklist={checklist} {...props} />
      ))}
    </>
  )
}

CardChecklistContainer.Static = ({ checklists }) => {
  if (!checklists) return null;

  console.log(checklists);
  return (
    <>
      {checklists.map(checklist => (
        <CardChecklist.Static key={checklist._id} checklist={checklist} />
      ))}
    </>
  )
}


CardChecklistContainer.Skeleton = () => {
  return (
    <>
      <CardChecklist.Skeleton />
      <CardChecklist.Skeleton />
    </>
  )
}

export default CardChecklistContainer
