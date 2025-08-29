import type { Card, CardUser } from '../../types';
import { columns } from '../columns/columns';
import { BurnBarrel } from './BurnBarrel';
import { Column } from './Column';

export const Board = ({
    cards,
    socket,
    filteredUser,
}: {
    cards: Card[];
    socket: any;
    filteredUser: CardUser | null;
}) => {
    return (
        <div className={`flex w-full gap-3 px-12 flex-1 overflow-hidden`}>
            {columns.map((col) => (
                <Column
                    index={col.index}
                    key={col.column}
                    title={col.name}
                    column={col.column}
                    headingColor={col.color}
                    cards={cards}
                    socket={socket}
                    filteredUser={filteredUser}
                />
            ))}
            <BurnBarrel socket={socket} />
        </div>
    );
};
