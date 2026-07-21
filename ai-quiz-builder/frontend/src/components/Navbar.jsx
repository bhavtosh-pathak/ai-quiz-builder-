import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mobileLinkClass = ({ isActive }) =>
  `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? 'text-primary-600 bg-primary-50' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
  }`;

const linkIcons = {
  'Dashboard': '📊',
  'My Quizzes': '📝',
  'AI Generator': '✨',
  'Browse Quizzes': '🔎',
  'Join by Code': '🔑',
  'My Results': '🏆',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Find the current section label for the breadcrumb strip below the header —
  // matches the longest link path that the current URL starts with.
  const activeLink = [...links]
    .sort((a, b) => b.to.length - a.to.length)
    .find((l) => location.pathname.startsWith(l.to));

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close dropdown on route change / escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-base font-semibold text-gold-400">
            Q
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">AI Quiz Builder</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Hamburger + Dropdown wrapper — relative so the panel can be positioned against it */}
          <div className="relative" ref={menuRef}>
            <button
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                menuOpen
                  ? 'border-primary-200 bg-primary-50 text-primary-600'
                  : 'border-ink/10 bg-white text-ink/70 hover:bg-ink/5'
              }`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="text-base leading-none">{menuOpen ? '✕' : '☰'}</span>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Dropdown drawer — anchored top-right, animated in */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-ink/10 bg-paper shadow-xl transition-all duration-150 ease-out ${
                menuOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
              }`}
            >
              <div className="p-2">
                {user && (
                  <Link
                    to={user.role === 'teacher' ? '/teacher/profile' : '/student/profile'}
                    className="flex items-center gap-2 px-3 py-2 mb-1 border-b border-ink/10 pb-3 hover:bg-ink/5 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                )}

                <nav className="space-y-1">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={mobileLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mr-2">{linkIcons[l.label]}</span>
                      {l.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-1 pt-1 border-t border-ink/10">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
                    >
                      Log out
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 px-1 pt-1">
                      <Link
                        to="/register"
                        className="btn-primary w-full text-sm text-center shadow-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        Get started 
                      </Link>
                      <Link
                        to="/login"
                        className="btn-secondary w-full text-sm text-center"
                        onClick={() => setMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary strip — shows which section of the app you're currently on */}
      {user && activeLink && (
        <div className="border-t border-ink/5 bg-ink/[0.02] px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 text-xs font-medium text-ink/50">
            <span>{linkIcons[activeLink.label]}</span>
            <span>{activeLink.label}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;