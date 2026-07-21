import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import SearchFilterBar from '../../components/SearchFilterBar';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import QuizCodeTicket from '../../components/QuizCodeTicket';
import { quizService } from '../../services/quizService';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
];

let debounceTimer;

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = useCallback((page = 1) => {
    setLoading(true);
    quizService
      .getMine({ search, status, page, limit: 9 })
      .then((res) => {
        setQuizzes(res.quizzes);
        setPagination(res.pagination);
      })
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchQuizzes(1), 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchQuizzes]);

  const handlePublish = async (id) => {
    try {
      await quizService.publish(id);
      toast.success('Quiz published — students can now join with the code');
      fetchQuizzes(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClose = async (id) => {
    try {
      await quizService.close(id);
      toast.success('Quiz closed');
      fetchQuizzes(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz permanently? This also deletes all attempts.')) return;
    try {
      await quizService.remove(id);
      toast.success('Quiz deleted');
      fetchQuizzes(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Manage</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">My Quizzes</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/teacher/generate" className="btn-gold text-sm">✨ Generate with AI</Link>
          <Link to="/teacher/quizzes/new" className="btn-primary text-sm">+ New quiz</Link>
        </div>
      </div>

      <div className="mb-6">
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          statusOptions={STATUS_OPTIONS}
        />
      </div>

      {loading ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="No quizzes match your filters"
          description="Try clearing the search, or create a new quiz."
          action={
            <Link to="/teacher/quizzes/new" className="btn-primary text-sm">
              Create a quiz
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q) => (
              <div key={q._id} className="surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold leading-snug">{q.title}</h3>
              <span
  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize shrink-0
    ${
      q.status === 'live'
        ? 'bg-green-100 text-green-600'
        : q.status === 'expired'
        ? 'bg-red-100 text-red-600'
        : q.status === 'closed'
        ? 'bg-gray-100 text-gray-600'
        : 'bg-blue-100 text-blue-600'
    }
  `}
>
  {q.status === 'live' && (
    <span className="h-2 w-2 rounded-full bg-green-500"></span>
  )}
  {q.status}
</span>
                </div>
                <p className="mt-1 text-xs text-ink/45">{q.subject}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/55">{q.description || 'No description provided.'}</p>

                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink/45">
                  <span>{q.questions.length} questions</span>
                  <span>{q.duration} min</span>
                  <span>{q.totalMarks} marks</span>
                </div>

                {q.status !== 'draft' && q.status !== 'expired' ? (
                  <div className="mt-3">
                    <QuizCodeTicket code={q.quizCode} />
                  </div>
                ) : (
                  <div className="mt-3 h-11" aria-hidden="true" />
                )}

               <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-ink/8">
                  {q.status === 'draft' && (
                    <Link
                      to={`/teacher/quizzes/${q._id}`}
                      className="rounded-full border border-ink/12 bg-white px-4 py-1.5 text-xs font-semibold text-ink/70 shadow-sm transition-all hover:border-ink/20 hover:bg-ink/5"
                    >
                      Edit
                    </Link>
                  )}
                  <Link
                    to={`/teacher/quizzes/${q._id}/results`}
                    className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
                  >
                    📊 Results
                  </Link>
                  {q.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(q._id)}
                      className="rounded-full bg-gold-500 px-4 py-1.5 text-xs font-semibold text-ink shadow-sm transition-all hover:bg-gold-600 hover:shadow-md"
                    >
                      Publish
                    </button>
                  )}
                  {q.status === 'published' && (
                    <button
                      onClick={() => handleClose(q._id)}
                      className="rounded-full border border-ink/12 bg-white px-4 py-1.5 text-xs font-semibold text-ink/70 shadow-sm transition-all hover:border-ink/20 hover:bg-ink/5"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="ml-auto rounded-full border border-danger/20 bg-danger-light px-4 py-1.5 text-xs font-semibold text-danger transition-all hover:bg-danger/10"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={pagination.page} pages={pagination.pages} onChange={fetchQuizzes} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default MyQuizzes;