export const extractMoveData = (list) => {
    return {
        _id: list._id,
        title: list.title,
        cards: list.cards.map(card => ({ _id: card._id, position: card.position, title: card.title }))
    }
}