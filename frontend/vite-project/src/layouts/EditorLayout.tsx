import { Outlet, Link } from 'react-router-dom';

export function EditorLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header>
        <Link to="/projects">← Volver a proyectos</Link>
      </header>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}