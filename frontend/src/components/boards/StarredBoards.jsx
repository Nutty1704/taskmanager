import { StarIcon } from 'lucide-react';
import CollapsibleBoardList from './CollapsibleBoardList';

const StarredBoards = ({ boards, starredBoards }) => {
    const filteredBoards = boards.filter(board => starredBoards.includes(board._id));

    return <CollapsibleBoardList title="Starred Boards" icon={StarIcon} boards={filteredBoards} />;
};

export default StarredBoards;
