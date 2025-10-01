import { Board } from './Board';
import { UsersFilter } from './UsersList/UsersFilter';
import { useEffect, useState, type SetStateAction } from 'react';
import { type Card, type CardUser } from '../../types';
import ExportModal from './ExportModal';
import SettingsModal from './settingsModal';
import { useRoom, useUser } from '../../context/Context';
import Header from './Header';
import { FaCheck, FaChevronLeft, FaChevronRight, FaX } from 'react-icons/fa6';
import { RiPresentationFill } from 'react-icons/ri';

const Main = (props: { socket: any; cards: any }) => {
    const [filteredUser, setFilteredUser] = useState<CardUser | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<CardUser[]>([]);

    const [presentation, setPresentation] = useState(false);
    const [presentationUser, setPresentationUser] = useState(0);

    const { socket, cards } = props;
    const { leave, room } = useRoom();
    const { user } = useUser();

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

    useEffect(() => {
        socket.onPresentation(
            (data: {
                presentation: boolean | ((prevState: boolean) => boolean);
                presentationUser: SetStateAction<number>;
            }) => {
                setPresentation(data.presentation);
                setPresentationUser(data.presentationUser);
            }
        );
    });

    useEffect(() => {
        window.history.pushState(
            {},
            '',
            `${window.location.pathname}?room=${encodeURIComponent(room!)}`
        );
        window.document.title = room
            ? `${room} - Sprint Board`
            : 'Bem vindo! - Sprint Board';
    }, [room]);

    useEffect(() => {
        const listenToShortcut = (e: any) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') previous();
        };

        users.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        setFilteredUser(presentation ? users[presentationUser] : null);

        if (presentation && user?.superUser) {
            document.addEventListener('keydown', listenToShortcut);
            socket.hideAll(false);
        }

        if (user?.superUser) {
            socket.presentation({ presentation, presentationUser });
        }

        return () => {
            document.removeEventListener('keydown', listenToShortcut);
        };
    }, [presentation, presentationUser]);

    const next = () => {
        if (users.length === 0) return;
        if (presentationUser === users.length - 1) {
            setPresentationUser(0);
            setPresentation(false);
            return;
        }
        setPresentationUser((prev) => prev + 1);
    };

    const previous = () => {
        if (users.length === 0) return;
        if (presentationUser === 0) {
            setPresentation(false);
            return;
        }
        setPresentationUser((prev) => prev - 1);
    };

    const handlePresentation = () => {
        setPresentation(!presentation);
    };

    return (
        <>
            {isSettingsModalOpen && (
                <SettingsModal socket={socket} handleSettings={handleSettings} />
            )}
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
                    handleExport={handleExport}
                    handleSettings={handleSettings}
                    setFilteredUser={setFilteredUser}
                    socket={socket}
                />
                <div className="print:hidden h-20 flex items-center justify-between px-10">
                    <UsersFilter
                        users={users}
                        filteredUser={filteredUser}
                        setFilteredUser={
                            presentation ? setPresentationUser : setFilteredUser
                        }
                        presentation={presentation}></UsersFilter>
                    <div className="flex items-center">
                        {user?.superUser && (
                            <button
                                onClick={() => handlePresentation()}
                                className={
                                    presentation
                                        ? `mr-2 px-2 h-10 w-34 disabled:text-white hover:w-34 flex gap-2 justify-end group items-center transition-all bg-red-300/50 dark:bg-red-700/25 cursor-pointer rounded-full hover:bg-red-500/25`
                                        : `px-2 h-10 w-10 disabled:text-white hover:w-34 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                                }>
                                <span
                                    className={
                                        presentation
                                            ? 'group-hover:block group-hover:w-full w-34 dark:text-slate-300 font-semibold'
                                            : 'group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden'
                                    }>
                                    {presentation ? 'Finalizar' : 'Apresentar'}
                                </span>
                                <p>
                                    {!presentation ? (
                                        <RiPresentationFill
                                            size={24}
                                            className="dark:text-white text-2xl"
                                        />
                                    ) : (
                                        <RiPresentationFill
                                            size={24}
                                            className="dark:text-white text-xl"
                                        />
                                    )}
                                </p>
                            </button>
                        )}
                        {presentation && user?.superUser && (
                            <>
                                <button
                                    className={`px-3 ps-4 h-10 flex gap-2 justify-end items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-s-full hover:bg-amber-500/25 ${
                                        presentationUser === 0
                                            ? 'hover:bg-red-500/30!'
                                            : ''
                                    }`}
                                    onClick={previous}>
                                    {presentationUser === 0 ? <FaX /> : <FaChevronLeft />}
                                </button>
                                <button
                                    className={`px-3 pe-4 h-10 flex gap-2 justify-end items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-e-full hover:bg-amber-500/25 ${
                                        presentationUser === users.length - 1
                                            ? 'hover:bg-emerald-500/30!'
                                            : ''
                                    }`}
                                    onClick={next}>
                                    {presentationUser === users.length - 1 ? (
                                        <FaCheck />
                                    ) : (
                                        <FaChevronRight />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <Board cards={cards} socket={socket} filteredUser={filteredUser} />
            </main>
        </>
    );
};

export default Main;
