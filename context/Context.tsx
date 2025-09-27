import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Column, Toast, User } from '../types';

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

type ColumnsContextType = {
    updateColumn: any;
    deleteColumn: any;
    setInitialColumns: any;
    columns: Column[];
    initialColumns: Column[];
};

type ToastsContextType = {
    toasts: Toast[];
    addToast: Function;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const RoomContext = createContext<RoomContextType | undefined>(undefined);
const ColumnsContext = createContext<ColumnsContextType | undefined>(undefined);
const ToastsContext = createContext<ToastsContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        localStorage.removeItem('user');
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
        sessionStorage.removeItem('room');
    };

    const contextValue: RoomContextType = {
        room,
        join,
        leave,
    };

    return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>;
};

export const ColumnProvider = ({ children }: { children: ReactNode }) => {
    const [columns, setColumns] = useState<Column[]>([]);

    const initialColumns = [
        { name: 'Devemos continuar', column: 'continue', color: 'emerald' },
        { name: 'Devemos Parar', column: 'stop', color: 'amber' },
        { name: 'Podemos melhorar', column: 'improve', color: 'red' },
        { name: 'Devemos Iniciar', column: 'start', color: 'sky' },
        // { name: 'Plano de ação', column: 'act', color: 'teal' },
    ];

    const updateColumn = (
        columnName: string,
        updatedColumn: Column,
        position?: number
    ) => {
        setColumns((columns) => {
            const columnToUpdate = columns.find((column) => column.column === columnName);
            console.log('Updating column: ', columnName, updatedColumn, columnToUpdate);
            if (columnToUpdate) {
                columnToUpdate.name = updatedColumn.name;
                columnToUpdate.color = updatedColumn.color;
                columnToUpdate.column = updatedColumn.column;
                console.log(`Column ${columnName} updated to:`, columnToUpdate);
            } else {
                console.error(`Column with name ${columnName} not found.`);
            }
            return columns;
        });
    };

    const deleteColumn = (columnId: string) => {
        console.log('Deleting column: ', columnId);

        setColumns((cols) => cols.filter((col) => col.column !== columnId));

        console.log(`Column ${columnId} deleted`);
    };

    const addColumn = (newColumn: Column, position: number) => {
        console.log('Adding column: ', newColumn.name, newColumn);

        setColumns((cols) => cols.splice(position, 0, newColumn));

        console.log(`Column ${newColumn} added`);
    };

    const setInitialColumns = (columns: Column[]) => {
        setColumns(columns);
    };

    const contextValue = {
        setInitialColumns,
        initialColumns,
        updateColumn,
        deleteColumn,
        addColumn,
        columns,
    };

    return (
        <ColumnsContext.Provider value={contextValue}>{children}</ColumnsContext.Provider>
    );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Toast) => {
        setToasts((current) => [...current, toast]);

        setTimeout(() => {
            setToasts((current) => current.filter((t) => t !== toast));
        }, 5000);
    };

    const contextValue = {
        addToast,
        toasts,
    };

    return (
        <ToastsContext.Provider value={contextValue}>{children}</ToastsContext.Provider>
    );
};

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
        throw new Error('useRoom deve ser usado dentro de um <RoomProvider>');
    }

    return context;
};

export const useColumns = () => {
    const context = useContext(ColumnsContext);
    if (!context) {
        throw new Error('useColumns deve ser usado dentro de um <ColumnsProvider>');
    }

    return context;
};

export const useToasts = () => {
    const context = useContext(ToastsContext);
    if (!context) {
        throw new Error('useToasts deve ser usado dentro de um <ToastsProvider>');
    }

    return context;
};
