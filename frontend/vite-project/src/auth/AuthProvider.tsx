import { useCallback, useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { tokenStorage } from './tokenStorage';
import { registerSessionExpiredHandler } from '../api/client';
import { decodeToken } from 'react-jwt';

type AccessTokenClaims = {
    displayName?: unknown;
};

function getDisplayName(): string | null {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) return null;

    try {
        const claims = decodeToken<AccessTokenClaims>(accessToken);
        return typeof claims?.displayName === 'string' ? claims.displayName : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [displayName, setDisplayName] = useState<string | null>(() => getDisplayName());
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => !!tokenStorage.getAccessToken()
    );

    //use callback to avoid unnecessary re-renders when the context value changes
    //useCallback is used to memoize the setAuthenticated function, so that it doesn't 
    // change on every render. This is important because the AuthContext.Provider value is an object 
    // that contains the setAuthenticated function, and if this function changes on every render, 
    // it will cause unnecessary re-renders of any components that consume the context.
    const setAuthenticated = useCallback((value: boolean) => {
        setIsAuthenticated(value);

        if (value) {
            setDisplayName(getDisplayName());
        } else {
            tokenStorage.clear();
            setDisplayName(null);
        }
    }, []);

    //useEffect to register the session expired handler when the component mounts
    //useEffect is used to register the session expired handler when the component mounts.
    useEffect(() => {
        registerSessionExpiredHandler(() => setAuthenticated(false));
    }, [setAuthenticated])

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, displayName }}>
            {children}
        </AuthContext.Provider>
    );
}