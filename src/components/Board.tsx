import { useColumns, useToasts } from '../../context/Context';
import type { Card, CardUser } from '../../types';
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
    const { columns } = useColumns();

    return (
        <div className={`flex w-full gap-3 px-12 flex-1 overflow-hidden`}>
            <div className="p-2 flex flex-col-reverse max-w-1/5 w-1/7 gap-2 items-end absolute bottom-30 h-full right-0 z-[-1]">
                {useToasts().toasts.map((toast) => {
                    return (
                        <div
                            key={toast.message}
                            className="rounded-xl border flex items-center transition-all w-full text-xl dark:border-neutral-700 border-neutral-300 bg-white dark:bg-neutral-800 p-3 gap-3">
                            <p>{toast.message}</p>
                        </div>
                    );
                })}
            </div>
            {columns.map((col, index) => (
                <Column
                    index={index}
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
