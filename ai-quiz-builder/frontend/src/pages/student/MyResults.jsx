import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { attemptService } from '../../services/attemptService';

const MyResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attemptService
      .getMine()
      .then((res) => setAttempts(res.attempts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="section-eyebrow">History</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">My Results</h1>
      </div>

      {loading ? (
        <Loader />
      ) : attempts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No attempts yet"
          description="Once you complete a quiz, your results will show up here."
          action={<Link to="/student/quizzes" className="btn-primary text-sm">Browse quizzes</Link>}
        />
      ) : (
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3">Quiz</th>
                <th className="px-5 py-3 text-right">Score</th>
                <th className="px-5 py-3 text-right">Percentage</th>
                <th className="px-5 py-3 text-right hidden sm:table-cell">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a._id} className="border-b border-ink/5 last:border-0 hover:bg-paper-dim">
                  <td className="px-5 py-3.5">
                    <Link to={`/student/results/${a._id}`} className="font-medium hover:text-primary-500">
                      {a.quiz?.title || 'Deleted quiz'}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono">
                    {a.score}/{a.totalMarks}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-primary-500">{a.percentage}%</td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-ink/45 hidden sm:table-cell">
                    {new Date(a.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyResults;
