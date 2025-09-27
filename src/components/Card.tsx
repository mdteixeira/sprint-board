import { motion } from 'framer-motion';
import { BiLike } from 'react-icons/bi';
import type { Card as ICard } from '../../types';
import { FaCircle } from 'react-icons/fa6';
import { DropIndicator } from './DropIndicator';
import { useUser } from '../../context/Context';

interface User {
    hidden: boolean;
    color: string;
    name: string;
}

export const Card: React.FC<ICard & { socket: any }> = ({
    title,
    id,
    column,
    user: cardUser,
    likes,
    socket,
}) => {
    interface DragEventWithCard extends React.DragEvent {
        dataTransfer: DataTransfer & {
            setData: (format: string, data: string) => void;
        };
    }

    interface DraggedCard {
        title: string;
        id: string;
        column: string;
        user: User;
    }

    const { user } = useUser();

    if (!user) return;

    const handleDragStart = (e: DragEventWithCard, card: DraggedCard): void => {
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('cardOwner', card.user.name);
    };

    function handleLike(): void {
        if (likes.some((like) => like.name === user!.name)) {
            likes = likes.filter((like) => like.name !== user!.name);
        } else {
            likes = [...likes, user];
        }

        if (socket) socket.updateCard(id, { title, id, column, user: cardUser, likes });
    }

    return (
        <>
            <DropIndicator headingColor={user.color} beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) =>
                    handleDragStart(e as unknown as DragEventWithCard, {
                        title,
                        id,
                        column,
                        user: cardUser,
                    })
                }
                className="cursor-grab rounded-xl border dark:border-neutral-700 border-neutral-300 bg-white dark:bg-neutral-800 p-3 active:cursor-grabbing space-y-2">
                <p
                    className={
                        cardUser.hidden
                            ? cardUser.name === user.name
                                ? 'bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-auto text-current/50 print:text-current'
                                : 'bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-auto text-transparent print:text-current print:bg-none'
                            : 'dark:text-neutral-100'
                    }>
                    <span className={'hidden'}>sai daqui</span>
                    {cardUser.hidden && cardUser.name !== user.name
                        ? title.replace(/./g, '•')
                        : title}
                </p>
                <div className="flex items-center justify-between space-x-1.5 dark:text-neutral-400 text-black">
                    <div className="flex gap-1 items-center">
                        <FaCircle
                            className={`h-1.5 w-1.5 text-${cardUser.color}-400`}></FaCircle>
                        <small className={`print: text=${cardUser.color}-400`}>
                            {cardUser.name}
                        </small>
                    </div>
                    <div className="flex items-center gap-1">
                        {likes.length ? (
                            likes.map((likedCardUser) => (
                                <div className="group" key={likedCardUser.name}>
                                    <BiLike
                                        onClick={handleLike}
                                        className={`h-4 w-4 text-${likedCardUser.color}-400 cursor-pointer group`}
                                    />
                                    <small className="absolute mt-2 px-4 py-1.5 rounded-xl group-hover:grid hidden dark:bg-neutral-800 border bg-neutral-100 text-neutral-700 border-neutral-300 dark:text-white dark:border-neutral-700 text-nowrap translate-x-[-50%]">
                                        {likedCardUser.name}
                                    </small>
                                </div>
                            ))
                        ) : (
                            <BiLike
                                onClick={handleLike}
                                className={`h-4 w-4 text-neutral-600 hover:text-${user.color}-400 transition-colors cursor-pointer print:hidden`}
                            />
                        )}
                        <small
                            className={
                                user ? `text-${user.color}-400` : 'text-neutral-600'
                            }></small>
                    </div>
                </div>
            </motion.div>
        </>
    );
};
