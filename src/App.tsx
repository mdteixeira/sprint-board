import { useEffect, useState } from 'react';
import type { Card, User } from '../types';
import SocketService from '../utils/Socket';
import { type Column, updateColumn } from './columns/columns';
import { RenderUserForm } from './screens/UserScreen';
import Main from './components/Main';

import { useRoom, useUser } from '../context/Context.js';

const App = () => {
    // const [loading, setLoading] = useState<boolean>(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [socket, setSocket] = useState<SocketService | null>(null);

    const { user, updateUser } = useUser();
    const { room } = useRoom();

    useEffect(() => {
        if (!room || !user) return;

        const socket = new SocketService('http://localhost:3000', room);
        setSocket(socket);

        socket.onRoomJoin((message: string) => console.log(message));

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
            console.log(` - New card added in room:`, newCard);
            setCards((prevCards) => [...prevCards, newCard]);
        });

        socket.onCardUpdate((cardId, updatedCard: Card) => {
            console.log(` - Card updated in room:`, cardId, updatedCard);
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
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
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
            console.log(` - Column updated:`, columnName);
            updateColumn(columnName, newColumn);
        });

        return () => {
            socket.disconnect();
        };
    }, [room]);

    return (
        <>
            <span className="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></span>
            <span className="text-red-400 text-orange-400 text-amber-400 text-yellow-400 text-lime-400 text-green-400 text-emerald-400 text-teal-400 text-cyan-400 text-sky-400 text-blue-400 text-indigo-400 text-violet-400 text-purple-400 text-fuchsia-400 text-pink-400 text-rose-400"></span>
            {
                //     loading ? (
                //     <div className="grid place-content-center h-screen overflow-hidden">
                //         <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-sky-500"></div>
                //     </div>
                // ) :
                room ? <Main socket={socket} cards={cards} /> : <RenderUserForm />
            }
        </>
    );
};

export default App;
