import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types'; // ajusta esse import se precisar

// Tipo do contexto
type UserContextType = {
    user: User | null;
    updateUser: (UserData: User) => void;
    logout: () => void;
};

type RoomContextType = {
    room: string | null;
    join: (room: string) => void;
    leave: () => void;
};

// Criação do contexto com valor inicial undefined
const UserContext = createContext<UserContextType | undefined>(undefined);
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Provider do contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('ue');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    const contextValue: UserContextType = {
        user,
        updateUser,
        logout,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const RoomProvider = ({ children }: { children: ReactNode }) => {
    const [room, setRoom] = useState<string | null>(null);

    const join = (room: string) => {
        sessionStorage.setItem('room', room);
        setRoom(room);
    };

    const leave = () => {
        setRoom(null);
        localStorage.removeItem('room');
    };

    const contextValue: RoomContextType = {
        room,
        join,
        leave,
    };

    return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>;
};

// Hook customizado para usar o contexto
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser deve ser usado dentro de um <UserProvider>');
    }

    return context;
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom deve ser usado dentro de um <UserProvider>');
    }

    return context;
};
