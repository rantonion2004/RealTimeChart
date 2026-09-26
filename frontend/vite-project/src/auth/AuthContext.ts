import { createContext } from 'react';

export type AuthContextValue = {
    displayName: string | null;
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);