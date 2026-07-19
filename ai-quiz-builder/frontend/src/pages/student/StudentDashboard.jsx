import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { PerformanceHistoryChart } from '../../components/Charts';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStudentStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader label="Loading dashboard..." /></DashboardLayout>;

  const { stats, performanceHistory, recentAttempts } = data;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1 mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Student dashboard</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
        </div>
        {/* <div className="flex gap-2">
          <Link to="/student/join" className="btn-gold text-sm">Join by code</Link>
          <Link to="/student/quizzes" className="btn-primary text-sm">Browse quizzes</Link>
        </div> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Available quizzes" value={stats.availableCount} eyebrow="Open now" />
        <StatCard label="Attempts" value={stats.totalAttempts} eyebrow="Completed" accent="gold" />
        <StatCard label="Average score" value={stats.averagePercentage} suffix="%" eyebrow="Overall" accent="primary" />
        <StatCard label="Best score" value={stats.bestPercentage} suffix="%" eyebrow="Personal best" accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <p className="section-eyebrow mb-4">Performance over time</p>
          {performanceHistory.length ? (
            <PerformanceHistoryChart data={performanceHistory} />
          ) : (
            <EmptyState icon="📈" title="No attempts yet" description="Take a quiz to start tracking your progress." />
          )}
        </div>

        <div className="surface p-5">
          <p className="section-eyebrow mb-4">Recent attempts</p>
          {recentAttempts.length ? (
            <ul className="space-y-3">
              {recentAttempts.map((a) => (
                <li key={a._id}>
                  <Link
                    to={`/student/results/${a._id}`}
                    className="flex items-center justify-between rounded-lg -mx-2 px-2 py-1.5 hover:bg-paper-dim text-sm"
                  >
                    <span className="truncate">{a.quiz?.title || 'Deleted quiz'}</span>
                    <span className="font-mono font-semibold text-primary-500 shrink-0 ml-2">{a.percentage}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/45">Nothing here yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;





