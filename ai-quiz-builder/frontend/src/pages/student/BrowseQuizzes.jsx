// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../layouts/DashboardLayout';
// import SearchFilterBar from '../../components/SearchFilterBar';
// import Pagination from '../../components/Pagination';
// import EmptyState from '../../components/EmptyState';
// import Loader from '../../components/Loader';
// import { quizService } from '../../services/quizService';

// let debounceTimer;

// const BrowseQuizzes = () => {
//   const navigate = useNavigate();
//   const [quizzes, setQuizzes] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchQuizzes = useCallback((page = 1) => {
//     setLoading(true);
//     quizService
//       .getAvailable({ search, page, limit: 9 })
//       .then((res) => {
//         setQuizzes(res.quizzes);
//         setPagination(res.pagination);
//       })
//       .finally(() => setLoading(false));
//   }, [search]);

//   useEffect(() => {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => fetchQuizzes(1), 300);
//     return () => clearTimeout(debounceTimer);
//   }, [fetchQuizzes]);

//   const startQuiz = async (code) => {
//     try {
//       await quizService.joinByCode(code);
//       navigate(`/student/attempt/${code}`);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <p className="section-eyebrow">Discover</p>
//         <h1 className="font-display text-3xl font-semibold tracking-tight">Browse Quizzes</h1>
//       </div>

//       <div className="mb-6">
//         <SearchFilterBar search={search} onSearchChange={setSearch} />
//       </div>

//       {loading ? (
//         <Loader />
//       ) : quizzes.length === 0 ? (
//         <EmptyState icon="🔍" title="No open quizzes right now" description="Check back soon, or join a specific quiz using its code." />
//       ) : (
//         <>
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {quizzes.map((q) => (
//               <div key={q._id} className="surface flex flex-col p-5">
//                 <h3 className="font-display text-lg font-semibold leading-snug">{q.title}</h3>
//                 <p className="mt-1 text-xs text-ink/45">{q.subject} · by {q.createdBy}</p>
//                 <p className="mt-2 line-clamp-2 text-sm text-ink/55">{q.description || 'No description provided.'}</p>
//                 <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink/45">
//                   <span>{q.questionCount} questions</span>
//                   <span>{q.duration} min</span>
//                   <span>{q.totalMarks} marks</span>
//                 </div>
//                 <button onClick={() => startQuiz(q.quizCode)} className="btn-primary mt-4 w-full">
//                   Start quiz
//                 </button>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6">
//             <Pagination page={pagination.page} pages={pagination.pages} onChange={fetchQuizzes} />
//           </div>
//         </>
//       )}
//     </DashboardLayout>
//   );
// };

// export default BrowseQuizzes;





import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import SearchFilterBar from '../../components/SearchFilterBar';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { quizService } from '../../services/quizService';

let debounceTimer;
const REFRESH_INTERVAL_MS = 30000; // re-check expiry status every 30s

const BrowseQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingCode, setStartingCode] = useState(null);
  const currentPageRef = useRef(1);

  const fetchQuizzes = useCallback((page = 1, { silent = false } = {}) => {
    if (!silent) setLoading(true);
    currentPageRef.current = page;
    quizService
      .getAvailable({ search, page, limit: 9 })
      .then((res) => {
        setQuizzes(res.quizzes);
        setPagination(res.pagination);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [search]);

  // Initial + search-triggered fetch (debounced)
  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchQuizzes(1), 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchQuizzes]);

  // Silent background refresh so a quiz's expired status updates on screen
  // automatically once its duration window passes, without a manual reload.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQuizzes(currentPageRef.current, { silent: true });
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQuizzes]);

  const startQuiz = async (code) => {
    setStartingCode(code);
    try {
      await quizService.joinByCode(code);
      navigate(`/student/attempt/${code}`);
    } catch (err) {
      if (err.status === 410 || /expired/i.test(err.message || '')) {
        toast.error('This quiz has expired.');
        fetchQuizzes(currentPageRef.current, { silent: true });
      } else {
        toast.error(err.message);
      }
    } finally {
      setStartingCode(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="section-eyebrow">Discover</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Browse Quizzes</h1>
      </div>

      <div className="mb-6">
        <SearchFilterBar search={search} onSearchChange={setSearch} />
      </div>

      {loading ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <EmptyState icon="🔍" title="No open quizzes right now" description="Check back soon, or join a specific quiz using its code." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q) => (
              <div key={q._id} className={`surface flex flex-col p-5 ${q.isExpired ? 'opacity-60' : ''}`}>
               <div className="flex items-start justify-between gap-2">
  <h3 className="font-display text-lg font-semibold leading-snug">
    {q.title}
  </h3>

  {q.isExpired ? (
    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
      Expired
    </span>
  ) : (
    <span className="flex items-center gap-1 shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
      <span className="h-2 w-2 rounded-full bg-green-500"></span>
      Live
    </span>
  )}
</div>
                <p className="mt-1 text-xs text-ink/45">{q.subject} · by {q.createdBy}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/55">{q.description || 'No description provided.'}</p>
                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink/45">
                  <span>{q.questionCount} questions</span>
                  <span>{q.duration} min</span>
                  <span>{q.totalMarks} marks</span>
                </div>
                <button
                  onClick={() => startQuiz(q.quizCode)}
                  disabled={q.isExpired || startingCode === q.quizCode}
                  className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q.isExpired ? 'Expired' : startingCode === q.quizCode ? 'Starting…' : 'Start quiz'}
                </button>
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

export default BrowseQuizzes;