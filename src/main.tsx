import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ColumnProvider, RoomProvider, UserProvider } from '../context/Context.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RoomProvider>
            <UserProvider>
            <ColumnProvider>
                <App />
            </ColumnProvider>
            </UserProvider>
        </RoomProvider>
    </StrictMode>
);
