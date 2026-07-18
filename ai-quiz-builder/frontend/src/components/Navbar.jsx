import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? 'text-primary-600 bg-primary-50' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/quizzes', label: 'My Quizzes' },
    { to: '/teacher/generate', label: 'AI Generator' },
  ];
  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/quizzes', label: 'Browse Quizzes' },
    { to: '/student/join', label: 'Join by Code' },
    { to: '/student/results', label: 'My Results' },
  ];
  const links = user?.role === 'teacher' ? teacherLinks : user?.role === 'student' ? studentLinks : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-base font-semibold text-gold-400">
            Q
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">AI Quiz Builder</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to={user.role === 'teacher' ? '/teacher/profile' : '/student/profile'}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink/5 transition-colors"
              >
                <span
                  className="grid h-8 w-8 place-items-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost !px-3 !py-2 text-sm">
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost !px-3 !py-2 text-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get started
              </Link>
            </div>
          )}

          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink/10 bg-paper px-4 py-3 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="btn-ghost w-full justify-start !px-3 !py-2 text-sm">
              Log out
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary flex-1 text-sm" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="btn-primary flex-1 text-sm" onClick={() => setMenuOpen(false)}>
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
