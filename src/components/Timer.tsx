import { useEffect, useState, useRef } from 'react';
import { BiMinus, BiPause, BiPlay, BiPlus } from 'react-icons/bi';

function Timer() {
    // Usamos um único estado para o tempo total em segundos.
    const [totalSeconds, setTotalSeconds] = useState(10 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<any | null>(null);

    // Efeito para iniciar e parar o timer.
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTotalSeconds((prevTotalSeconds) => {
                    // Paramos o timer se o tempo chegar a zero.
                    if (prevTotalSeconds <= 1) {
                        setIsRunning(false);
                        clearInterval(intervalRef.current!);
                        return 0;
                    }
                    return prevTotalSeconds - 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            // Se o timer não estiver rodando, limpamos o intervalo.
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Função de limpeza para garantir que o intervalo seja parado.
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    // Lógica para incrementar o tempo em 1 minuto (60 segundos).
    const increment = () => {
        if (!isRunning) {
            setTotalSeconds((prev) => prev + 60);
        }
    };

    // Lógica para decrementar o tempo em 1 minuto (60 segundos).
    const decrement = () => {
        if (!isRunning && totalSeconds > 60) {
            setTotalSeconds((prev) => prev - 60);
        }
    };

    // Alterna entre iniciar/pausar o temporizador.
    const handleTimer = () => {
        // Se o tempo for zero, reinicia para o valor padrão (10 minutos) e começa a contagem.
        if (totalSeconds === 0) {
            setTotalSeconds(10 * 60);
            setIsRunning(true);
        } else {
            setIsRunning((prevIsRunning) => !prevIsRunning);
        }
    };

    // Função para formatar o tempo em "MM:SS".
    const formatTime = () => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');
        return `${displayMinutes}:${displaySeconds}`;
    };

    return (
        <div className="absolute mt-32 h-14 w-full text-center grid items-center justify-center bg-neutral-800">
            <div className="grid items-center grid-cols-3 justify-items-center">
                <button
                    disabled={isRunning}
                    className="border border-neutral-600 bg-white dark:bg-neutral-600/50 hover:dark:bg-neutral-700/50 cursor-pointer rounded-full h-8 w-12 grid items-center justify-center disabled:opacity-25"
                    onClick={increment}>
                    <BiPlus />
                </button>
                <button
                    onClick={handleTimer}
                    className={`group border border-neutral-600 bg-white dark:bg-neutral-600/50 px-10 hover:dark:bg-neutral-700/50 cursor-pointer rounded-full h-8 w-12 grid items-center justify-center ${
                        isRunning ? 'animate-pulse' : ''
                    }`}>
                    <span className="block group-hover:hidden">{formatTime()}</span>
                    <span className="hidden group-hover:block text-3xl">
                        {isRunning ? <BiPause /> : <BiPlay />}
                    </span>
                </button>
                <button
                    disabled={isRunning}
                    className="border border-neutral-600 bg-white dark:bg-neutral-600/50 hover:dark:bg-neutral-700/50 cursor-pointer rounded-full h-8 w-12 grid items-center justify-center disabled:opacity-25"
                    onClick={decrement}>
                    <BiMinus />
                </button>
            </div>
        </div>
    );
}

export default Timer;
