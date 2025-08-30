import { BsStarFill } from 'react-icons/bs';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';
import { PiExport } from 'react-icons/pi';
import { useRoom, useUser } from '../../context/Context';
import { useEffect, useState, type MouseEventHandler } from 'react';
import { BiSolidStopwatch, BiStopwatch } from 'react-icons/bi';
import Timer from './Timer';

type HeaderProps = {
    handleLeave: MouseEventHandler<HTMLButtonElement>;
    handleHide: MouseEventHandler<HTMLButtonElement>;
    handleExport: MouseEventHandler<HTMLButtonElement>;
    handleSettings: MouseEventHandler<HTMLButtonElement>;
    setFilteredUser: any;
};

const Header = (props: HeaderProps) => {
    const { user } = useUser();
    const { room } = useRoom();

    const { handleLeave, handleHide, handleExport, handleSettings, setFilteredUser } =
        props;

    const [timer, setTimer] = useState<number>(0);

    function handleStopwatch() {
        setTimer(timer ? 0 : 1);
    }

    useEffect(() => {
        timer ? setFilteredUser({ ...user }) : setFilteredUser(null);
    }, [timer]);

    return (
        <header
            className={`px-2 grid grid-cols-3 items-center justify-items-center py-1.5 bg-slate-500/5 sticky print:hidden`}>
            {timer ? <Timer /> : null}
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
            <h2 className="dark:text-slate-300 font-semibold">{room}</h2>
            <div className="flex w-full gap-2 justify-end">
                <button
                    onClick={handleStopwatch}
                    className={
                        timer
                            ? `px-2 h-10 w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-pink-400/25 cursor-pointer rounded-full hover:bg-pink-400/25`
                            : `px-2 h-10 w-10 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-pink-400/25`
                    }>
                    <span
                        className={
                            timer
                                ? 'group-hover:block group-hover:w-full w-32 dark:text-slate-300 font-semibold'
                                : 'group-hover:block group-hover:w-full w-0 hidden dark:text-slate-300 font-semibold overflow-hidden'
                        }>
                        {timer ? 'Parar' : 'Iniciar'}
                    </span>
                    <p>
                        {!timer ? (
                            <BiStopwatch size={24} className="dark:text-white text-2xl" />
                        ) : (
                            <BiSolidStopwatch
                                size={24}
                                className="dark:text-white text-xl"
                            />
                        )}
                    </p>
                </button>
                <button
                    onClick={handleHide}
                    className={
                        user!.hidden
                            ? `px-2 h-10 w-32 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
                            : `px-2 h-10 w-10 disabled:text-white hover:w-32 flex gap-2 justify-end group items-center transition-all bg-neutral-300/50 dark:bg-slate-700/25 cursor-pointer rounded-full hover:bg-sky-500/25`
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
                            <FaEyeSlash size={24} className="dark:text-white text-2xl" />
                        ) : (
                            <FaEye size={24} className="dark:text-white text-xl" />
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
                        <PiExport size={24} className="dark:text-white text-2xl" />
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
        </header>
    );
};

export default Header;
