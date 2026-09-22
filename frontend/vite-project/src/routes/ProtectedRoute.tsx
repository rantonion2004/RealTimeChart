import {Navigate} from 'react-router-dom'
import type { ReactNode } from 'react'
import { tokenStorage } from '../auth/tokenStorage'

export function ProtectedRoute({children}: {children: ReactNode}){
    const hasToken = !!tokenStorage.getAccessToken();
    if(!hasToken){
        return<Navigate to="/login" replace/>
    }

    return <>{children}</>
}