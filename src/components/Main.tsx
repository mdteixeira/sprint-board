import { Board } from './Board';
import { UsersFilter } from './UsersList/UsersFilter';
import { useEffect, useState } from 'react';
import type { Card, CardUser } from '../../types';
import ExportModal from './ExportModal';
import SettingsModal from './settingsModal';
import { useRoom, useUser } from '../../context/Context';
import Header from './Header';

const Main = (props: { socket: any; cards: any }) => {
    const [filteredUser, setFilteredUser] = useState<CardUser | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<CardUser[]>([]);

    const { socket, cards } = props;
    const { user, updateUser } = useUser();
    const { leave, room } = useRoom();

    function handleHide(): void {
        if (socket && user) {
            updateUser({ ...user, hidden: !user.hidden });
            socket.updateUser({ ...user, hidden: !user.hidden });
        }
    }

    function handleExport(_event: any): void {
        setIsExportModalOpen(!isExportModalOpen);
    }

    function handleSettings(_event: any): void {
        setIsSettingsModalOpen(!isSettingsModalOpen);
    }

    function handleLeave(): void {
        leave();
    }

    useEffect(() => {
        const users: CardUser[] = [];

        cards.map((card: Card) => {
            if (
                users.find((user) => {
                    return user.name === card.user.name;
                })
            )
                return;
            users.push(card.user);
        });
        setUsers(users);
    }, [cards]);

    return (
        <>
            {isSettingsModalOpen && <SettingsModal handleSettings={handleSettings} />}
            {isExportModalOpen && (
                <ExportModal cards={cards} handleExport={handleExport} />
            )}
            <main className="w-full dark:text-neutral-50 text-neutral-700 min-h-screen flex flex-col">
                <h2>
                    <span className="dark:text-slate-300 font-semibold hidden print:block w-screen py-2.5 mb-5 text-center">
                        <h2 className="text-2xl">{room}</h2>
                        <small className="mt-4">Users:</small>
                        <div className="flex justify-center gap-10">
                            {users.map((user: CardUser) => (
                                <small
                                    key={user.name}
                                    className={`text-${user?.color}-400 font-semibold`}>
                                    {user.name}
                                </small>
                            ))}
                        </div>
                        <hr className="border-slate-200 text-center mx-auto mt-2" />
                    </span>
                </h2>
                <Header
                    handleLeave={handleLeave}
                    handleHide={handleHide}
                    handleExport={handleExport}
                    handleSettings={handleSettings}
                    setFilteredUser={setFilteredUser}
                />
                <div
                    className="print:hidden h-20 flex items-center justify-between px-10">
                    <UsersFilter
                        users={users}
                        filteredUser={filteredUser}
                        setFilteredUser={setFilteredUser}></UsersFilter>
                </div>
                <Board cards={cards} socket={socket} filteredUser={filteredUser} />
            </main>
        </>
    );
};

export default Main;
