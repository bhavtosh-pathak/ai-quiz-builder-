import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-paper bg-grid-lines bg-[size:24px_24px] px-4 text-center">
    <p className="font-mono text-sm text-primary-500 mb-2">Error 404</p>
    <h1 className="font-display text-5xl font-semibold tracking-tight">Page not found</h1>
    <p className="mt-3 max-w-sm text-ink/50">
      The page you're looking for doesn't exist, or you don't have access to view it.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to home
    </Link>
  </div>
);

export default NotFound;
