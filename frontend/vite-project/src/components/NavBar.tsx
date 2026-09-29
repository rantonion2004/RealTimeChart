import { Link } from 'react-router-dom';

export function NavBar({ onLogout, dispName }: { onLogout: () => void; dispName: string | null }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f0f0f0'}}>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>{dispName ?? 'Usuario'}</li>
        </ul>
      </nav>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}