import { useEffect, useState, useRef } from 'react';
import { BiMinus, BiPause, BiPlay, BiPlus } from 'react-icons/bi';
import type SocketClient from '../../utils/Socket';
import { useUser } from '../../context/Context';
import { FaEyeSlash, FaEye } from 'react-icons/fa6';
import { IoFilter, IoFilterOutline } from 'react-icons/io5';

type TimerProps = {
    setTimer: any;
    setFilteredUser: any;
    socket: SocketClient;
};

function Timer(props: TimerProps) {
    const [totalSeconds, setTotalSeconds] = useState(10 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [areCardsHidden, setCardsHidden] = useState(false);
    const [areUsersFiltered, setUsersFilter] = useState(false);

    const intervalRef = useRef<any | null>(null);

    const { socket, setFilteredUser } = props;
    const { user, updateUser } = useUser();

    useEffect(() => {
        socket.onTimerUpdate((totalSeconds, isRunning) => {
            setTotalSeconds(totalSeconds);
            setIsRunning(isRunning);
        });
    }, []);

    const increment = () => {
        if (!isRunning) {
            setTotalSeconds((prev) => prev + 60);
        }
    };

    const decrement = () => {
        if (!isRunning) {
            if (totalSeconds > 60) setTotalSeconds((prev) => prev - 60);
            else if (totalSeconds > 30) {
                setTotalSeconds((prev) => prev - 30);
            } else if (totalSeconds > 10) {
                setTotalSeconds((prev) => prev - 10);
            }
        }
    };

    useEffect(() => {
        if (user?.superUser) socket.TimerUpdate(totalSeconds, isRunning);
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTotalSeconds((prevTotalSeconds) => {
                    if (prevTotalSeconds <= 1) {
                        setIsRunning(false);
                        clearInterval(intervalRef.current!);
                        return 0;
                    }
                    return prevTotalSeconds - 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handleTimer = () => {
        if (totalSeconds === 0) {
            setTotalSeconds(10 * 60);
            setIsRunning(true);
        } else {
            setIsRunning((prevIsRunning) => !prevIsRunning);
        }
    };

    const formatTime = () => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');
        return `${displayMinutes}:${displaySeconds}`;
    };

    function handleHideAll(): void {
        socket.hideAll(!areCardsHidden);
    }

    useEffect(() => {
        socket.onHideUpdate((hidden) => {
            setCardsHidden(hidden);
            updateUser({
                name: user!.name,
                hidden,
                color: user!.color,
                superUser: user?.superUser,
            });
            socket.updateUser({
                name: user!.name,
                hidden,
                color: user!.color,
                superUser: user?.superUser,
            });
        });
    }, []);

    function handleFilterUser(): void {
        socket.FilterUsers(!areUsersFiltered);
    }
    useEffect(() => {
        socket.onUsersFilterUpdate((filtered) => {
            setUsersFilter(filtered);
            filtered ? setFilteredUser({ ...user }) : setFilteredUser(null);
        });
    }, []);

    return (
        <div className="absolute mt-30 h-16 w-full text-center flex justify-center items-center dark:bg-neutral-800 bg-white">
            {user?.superUser ? (
                <div className="grid grid-cols-3 w-full px-2 items-center">
                    <button
                        onClick={handleFilterUser}
                        className={`float-start px-2 h-10 ${
                            areUsersFiltered
                                ? 'w-44 hover:w-44 bg-red-500/35 dark:bg-red-500/35!'
                                : 'w-10 hover:w-50'
                        } text-nowrap grid grid-cols-12 gap-4 group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-red-500/25 text-start`}>
                        {areUsersFiltered ? (
                            <>
                                <IoFilterOutline
                                    size={24}
                                    className="text-2xl transition-none grid-cols-1"
                                />
                                <span className="group-hover:block w-0.5 dark:text-slate-300 font-semibold grid-cols-11 pl-5">
                                    Remover filtro
                                </span>
                            </>
                        ) : (
                            <>
                                <IoFilter
                                    size={24}
                                    className="text-2xl transition-none grid-cols-1"
                                />
                                <span className="group-hover:block w-0.5 hidden dark:text-slate-300 font-semibold grid-cols-11 pl-5">
                                    Filtrar por usuários
                                </span>
                            </>
                        )}
                    </button>
                    <span className="flex gap-4 mx-auto">
                        <button
                            disabled={isRunning}
                            className="border dark:border-neutral-700 border-neutral-300 bg-neutral-50 dark:bg-neutral-700/50 hover:dark:bg-neutral-700/50 cursor-pointer rounded-full h-12 w-12 flex items-center justify-center disabled:opacity-25"
                            onClick={decrement}>
                            <BiMinus />
                        </button>
                        <button
                            onClick={handleTimer}
                            className={`group px-10 cursor-pointer text-2xl w-12 grid items-center justify-center ${
                                isRunning ? 'animate-pulse' : ''
                            }`}>
                            <span className="block group-hover:hidden">
                                {formatTime()}
                            </span>
                            {
                                <span className="hidden group-hover:block text-3xl">
                                    {isRunning ? <BiPause /> : <BiPlay />}
                                </span>
                            }
                        </button>
                        <button
                            disabled={isRunning}
                            className="border dark:border-neutral-700 border-neutral-300 bg-neutral-50 dark:bg-neutral-700/50 hover:dark:bg-neutral-700/50 cursor-pointer rounded-full h-12 w-12 flex items-center justify-center disabled:opacity-25"
                            onClick={increment}>
                            <BiPlus />
                        </button>
                    </span>
                    <button
                        onClick={handleHideAll}
                        className={
                            areCardsHidden
                                ? `ml-auto px-2 h-10 w-44 disabled:text-white hover:w-44 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25 text-nowrap`
                                : `ml-auto px-2 h-10 w-10 disabled:text-white hover:w-44 text-nowrap flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                        }>
                        <span
                            className={
                                areCardsHidden
                                    ? 'group-hover:block group-hover:w-full w-32 dark:text-slate-300 font-semibold'
                                    : 'group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden'
                            }>
                            {areCardsHidden ? 'Mostrar todos' : 'Esconder todos'}
                        </span>
                        <p>
                            {!areCardsHidden ? (
                                <FaEyeSlash
                                    size={24}
                                    className="dark:text-white text-2xl"
                                />
                            ) : (
                                <FaEye size={24} className="dark:text-white text-xl" />
                            )}
                        </p>
                    </button>
                </div>
            ) : (
                <span
                    className={`group text-xl px-12 grid items-center justify-center ${
                        isRunning ? 'animate-pulse' : ''
                    }`}>
                    {/* {isRunning ? formatTime() : <BiPause className="text-3xl" />} */}
                    {formatTime()}
                </span>
            )}
        </div>
    );
}

export default Timer;
