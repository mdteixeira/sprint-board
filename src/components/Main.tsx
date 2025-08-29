import { BsStarFill } from 'react-icons/bs';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';
import { PiExport } from 'react-icons/pi';
import { Board } from './Board';
import { UsersFilter } from './UsersList/UsersFilter';
import { useEffect, useState } from 'react';
import type { Card, CardUser } from '../../types';
import ExportModal from './ExportModal';
import SettingsModal from './settingsModal';
import { useRoom, useUser } from '../../context/Context';

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
                <div
                    className={`px-2 grid grid-cols-3 items-center justify-items-center py-1.5 bg-slate-500/5 sticky print:hidden`}>
                    <div className="flex gap-4 items-center w-full">
                        <button
                            onClick={handleLeave}
                            className={`px-2 h-10 w-10 hover:w-22 grid grid-cols-2 group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25`}>
                            <IoExitOutline
                                size={24}
                                className="text-2xl transition-none"></IoExitOutline>
                            <span className="group-hover:block w-0.5 hidden dark:text-slate-300 font-semibold">
                                Sair
                            </span>
                        </button>
                        <span
                            className={`text-${user?.color}-400 font-semibold flex items-center gap-2`}>
                            {user!.name}{' '}
                            {user?.superUser && (
                                <button
                                    className={`rounded-full text-amber-500 dark:bg-amber-600/20 bg-amber-200/50`}>
                                    <BsStarFill className="m-2" />
                                </button>
                            )}
                        </span>
                    </div>
                    <h2>
                        <span className="dark:text-slate-300 font-semibold">{room}</span>
                    </h2>
                    <div className="flex w-full gap-2 justify-end">
                        <button
                            onClick={handleHide}
                            className={
                                user!.hidden
                                    ? `px-2 h-10 w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                                    : `px-2 h-10 w-10 disabled:w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                            }>
                            <span
                                className={
                                    user!.hidden
                                        ? 'group-hover:block group-hover:w-full w-32 dark:text-slate-300 font-semibold'
                                        : 'group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden'
                                }>
                                {user!.hidden ? 'Mostrar' : 'Esconder'}
                            </span>
                            <p>
                                {!user!.hidden ? (
                                    <FaEyeSlash
                                        size={24}
                                        className="dark:text-white text-2xl"
                                    />
                                ) : (
                                    <FaEye
                                        size={24}
                                        className="dark:text-white text-xl"
                                    />
                                )}
                            </p>
                        </button>
                        <button
                            onClick={handleExport}
                            className={`px-2 h-10 w-10 hover:w-30 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-emerald-500/25`}>
                            <span className="group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden">
                                Exportar
                            </span>
                            <p>
                                <PiExport
                                    size={24}
                                    className="dark:text-white text-2xl"
                                />
                            </p>
                        </button>
                        <button
                            onClick={handleSettings}
                            className={`px-2 h-10 w-10 hover:w-42 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-amber-500/25`}>
                            <span className="group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden">
                                Configurações
                            </span>
                            <p>
                                <FaGear size={24} className="dark:text-white text-2xl" />
                            </p>
                        </button>
                    </div>
                </div>
                <div
                    id={'UsersFilter'}
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
