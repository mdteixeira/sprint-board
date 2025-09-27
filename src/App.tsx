import { useEffect, useState } from 'react';
import type { Card, Column, User } from '../types';
import SocketService from '../utils/Socket';
import { RenderUserForm } from './screens/UserScreen';
import Main from './components/Main';

import { useColumns, useRoom, useToasts, useUser } from '../context/Context.js';

const App = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [socket, setSocket] = useState<SocketService | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { user, updateUser } = useUser();
    const { room, join } = useRoom();
    const { addToast } = useToasts();

    const { updateColumn, deleteColumn, setInitialColumns, initialColumns } =
        useColumns();

    useEffect(() => {
        const storedRoom = sessionStorage.getItem('room');

        if (storedRoom) {
            join(storedRoom);
        }

        if (!room || !user) return;

        const socket = new SocketService('http://localhost:3000', room, user);
        setSocket(socket);
        setLoading(true);
        setInitialColumns(initialColumns);

        socket.onRoomJoin((eventuser) => {
            if (eventuser.name === user.name) setLoading(false);
            else {
                addToast({ message: `${eventuser.name} entrou na sala` });
            }
        });

        socket.onInitialCards((initialCards: Card[]) => {
            setCards(initialCards);

            const updatedUserData =
                initialCards.find((card) => user && card.user.name === user.name) || null;

            if (updatedUserData && user) {
                updateUser({
                    ...user,
                    color: updatedUserData.user.color,
                    hidden: updatedUserData.user.hidden,
                });
            }
        });

        socket.onRoomLeave((message: string) => {
            console.log(message);
        });

        socket.onCardAdd((newCard: Card) => {
            console.log(` - New card added in room`);
            setCards((prevCards) => [...prevCards, newCard]);
        });

        socket.onCardUpdate((cardId, updatedCard: Card) => {
            console.log(` - Card updated in room:`, cardId);
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.id === cardId) {
                        return { ...card, ...updatedCard };
                    }
                    return card;
                })
            );
        });

        socket.onCardRemove((cardId: string) => {
            console.log(` - Card removed from room:`, cardId);
            setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
        });

        socket.onUserUpdate((updatedUser: User) => {
            console.log(` - User updated:`, updatedUser);
            if (updatedUser.name === user.name) updateUser(updatedUser);
            setCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.user.name === updatedUser.name) {
                        return { ...card, user: updatedUser };
                    }
                    return card;
                })
            );
        });

        socket.onColumnUpdate((columnName: string, newColumn: Column) => {
            console.log(` - Column updated:`, columnName, newColumn);
            updateColumn(columnName, newColumn);
        });

        socket.onColumnDelete((columnName: string) => {
            console.log(` - Column deleted:`, columnName);
            deleteColumn(columnName);
        });

        return () => {
            setCards([]);
            socket.disconnect();
        };
    }, [room]);

    return (
        <>
            {room ? (
                loading ? (
                    <div className="grid place-content-center text-center h-screen overflow-hidden">
                        <div
                            className={`animate-spin rounded-full size-12 mx-auto mb-5 border-t-2 shadow-teal-50 inset-shadow-zinc-800 border-${user?.color}-500`}></div>
                        <h2>
                            Entrando na sala <span className="font-semibold">{room}</span>
                        </h2>
                    </div>
                ) : (
                    <Main socket={socket} cards={cards} />
                )
            ) : (
                <RenderUserForm />
            )}
        </>
    );
};

export default App;
