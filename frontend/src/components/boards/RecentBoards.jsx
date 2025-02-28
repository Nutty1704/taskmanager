import { Clock } from 'lucide-react';
import CollapsibleBoardList from './CollapsibleBoardList';

const RecentBoards = ({ boards, recentBoards }) => {
    const filteredBoards = recentBoards
        .map(id => boards.find(board => board._id === id))
        .filter(Boolean)
        .slice(0, 5);

    return <CollapsibleBoardList title="Recent Boards" icon={Clock} boards={filteredBoards} />;
};

export default RecentBoards;
