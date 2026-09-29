import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';

export function AppLayout() {
  const { displayName } = useAuth();
  const { logoutUser } = useAuthActions();

  return (
    <>
      <NavBar onLogout={logoutUser} dispName={displayName} />
      <Outlet />
    </>
  );
}