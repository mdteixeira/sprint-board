import { motion } from 'framer-motion';
import { BiLike } from 'react-icons/bi';
import type { Card as ICard } from '../../types';
import { FaCircle } from 'react-icons/fa6';
import { DropIndicator } from './DropIndicator';
import { useUser } from '../../context/Context';
import { useEffect, useState } from 'react';

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
        if (likes.some((like) => like.name === user!.name))
            likes = likes.filter((like) => like.name !== user!.name);
        else likes = [...likes, user];

        if (socket) socket.updateCard(id, { title, id, column, user: cardUser, likes });
    }

    function handleUpdateCard(e) {
        e.preventDefault();
        if (socket && editedValue.trim().length > 0 && editedValue !== title)
            socket.updateCard(id, {
                title: editedValue,
                id,
                column,
                user: cardUser,
                likes,
            });
        setEditing(false);
    }

    useEffect(() => {
        setEditedValue(title);
    }, [title]);

    const [editMode, setEditMode] = useState(false);
    const [editing, setEditing] = useState(false);
    const [shiftKeyDown, setShiftKeyDown] = useState(false);
    const [editedValue, setEditedValue] = useState(title);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                e.stopPropagation();
                setEditMode((editMode) => !editMode);
            }
            if (e.shiftKey) setShiftKeyDown(true);

            if (e.key === 'Escape') {
                setEditMode(false);
                setEditing(false);
            }
            if (e.key === 'Shift') {
                setShiftKeyDown(true);
            }
        };
        const handleKeyUp = (event) => {
            if (event.key === 'Shift') {
                setShiftKeyDown(false);
            }
        };

        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <>
            <DropIndicator headingColor={user.color} beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onClick={() => {
                    if ((shiftKeyDown || editMode) && user.name === cardUser.name)
                        setEditing(true);
                }}
                onDoubleClick={() => {
                    if (!shiftKeyDown) return;
                    setEditMode(true);
                    setEditing(true);
                }}
                onDragStart={(e) =>
                    handleDragStart(e as unknown as DragEventWithCard, {
                        title,
                        id,
                        column,
                        user: cardUser,
                    })
                }
                className={`cursor-grab rounded-xl border dark:border-neutral-700 border-neutral-300 bg-white dark:bg-neutral-800 p-3 active:cursor-grabbing space-y-2 ${
                    shiftKeyDown && user.name === cardUser.name
                        ? 'hover:bg-purple-400/20'
                        : ''
                } ${
                    editMode && user.name === cardUser.name
                        ? `cursor-text group bg-purple-500/20! ${
                              title !== editedValue
                                  ? 'animate-pulse bg-purple-400/30'
                                  : ''
                          } ${editing ? `bg-purple-400/25! ` : ''}`
                        : 'cursor-grab'
                }`}>
                {editMode && user.name === cardUser.name ? (
                    <form onSubmit={handleUpdateCard} className="w-full grid h-auto">
                        <textarea
                            value={editedValue}
                            minLength={1}
                            onChange={(e) => {
                                setEditedValue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === `Enter`) handleUpdateCard(e);
                            }}
                            className={
                                cardUser.hidden
                                    ? cardUser.name === user.name
                                        ? 'bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-full text-current/50 print:text-current field-sizing-content transition-all overflow-y-hidden resize-none'
                                        : 'bg-neutral-100 dark:bg-neutral-700/40 rounded-md w-full text-transparent print:text-current print:bg-none field-sizing-content transition-all overflow-y-hidden resize-none'
                                    : 'dark:text-neutral-100 field-sizing-content transition-all overflow-y-hidden resize-none'
                            }
                            autoFocus
                        />
                    </form>
                ) : (
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
                            ? title.replace(/./g, '.')
                            : title}
                    </p>
                )}

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
