import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { QuizPerformanceChart } from '../../components/Charts';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [cheatingAlerts, setCheatingAlerts] = useState([]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getTeacherStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket || !connected) return;

    const handleCheating = (data) => {
      setCheatingAlerts((prev) => {
        // Avoid stacking duplicate alerts for the same student+quiz —
        // just refresh the type/time/violationCount on the existing entry.
        const existingIndex = prev.findIndex(
          (a) => a.studentId === data.studentId && a.quizId === data.quizId
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }

        return [...prev, data];
      });

      toast.error(`⚠️ ${data.studentName} switched tabs`);
    };

    // Fired by the backend once a student's attempt is submitted/ends —
    // clears their alert out of the live box since it's no longer "live".
    const handleAttemptEnded = ({ quizId, studentId }) => {
      setCheatingAlerts((prev) =>
        prev.filter((a) => !(a.studentId === studentId && a.quizId === quizId))
      );
    };

    socket.on('quiz:cheatingDetected', handleCheating);
    socket.on('quiz:attemptEnded', handleAttemptEnded);

    return () => {
      socket.off('quiz:cheatingDetected', handleCheating);
      socket.off('quiz:attemptEnded', handleAttemptEnded);
    };
  }, [socket, connected]);

  if (loading) return <DashboardLayout><Loader label="Loading dashboard..." /></DashboardLayout>;

  const { stats, quizPerformance, topPerformers, recentQuizzes } = data;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1 mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Educator dashboard</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/teacher/generate" className="btn-gold text-sm">✨ Generate with AI</Link>
          <Link to="/teacher/quizzes/new" className="btn-primary text-sm">+ New quiz</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total quizzes" value={stats.totalQuizzes} eyebrow="Created" />
        <StatCard label="Total students" value={stats.totalStudents} eyebrow="Reached" accent="gold" />
        <StatCard label="Total attempts" value={stats.totalAttempts} eyebrow="Submitted" accent="success" />
        <StatCard label="Average score" value={stats.averageScore} suffix="%" eyebrow="Across quizzes" accent="primary" />
      </div>

      {/* <div className="surface p-5 mb-6">
        <p className="section-eyebrow mb-4">🚨 Live Cheating Alerts</p>

        {cheatingAlerts.length === 0 ? (
          <p className="text-sm text-ink/45">No cheating detected</p>
        ) : (
          <div className="space-y-3">
            {cheatingAlerts.map((alert) => (
              <div
                key={`${alert.quizId}-${alert.studentId}`}
                className="flex justify-between items-center rounded-lg bg-red-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-red-600">⚠️ {alert.studentName}</p>
                  <p className="text-sm text-gray-500">{alert.type}</p>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <p className="section-eyebrow mb-4">Quiz performance</p>
          {quizPerformance.length ? (
            <QuizPerformanceChart data={quizPerformance} />
          ) : (
            <EmptyState icon="📊" title="No data yet" description="Publish a quiz and collect attempts to see performance here." />
          )}
        </div>

        <div className="surface p-5">
          <p className="section-eyebrow mb-4">Top performers</p>
          {topPerformers.length ? (
            <ul className="space-y-3">
              {topPerformers.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-50 font-mono text-xs font-bold text-gold-600">
                      {i + 1}
                    </span>
                    {p.studentName}
                  </span>
                  <span className="font-mono font-semibold text-primary-500">{p.percentage}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/45">No submissions yet.</p>
          )}
        </div>
      </div>

      {/* <div className="surface p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="section-eyebrow">Recent quizzes</p>
          <Link to="/teacher/quizzes" className="text-xs font-semibold text-primary-500 hover:underline">
            View all →
          </Link>
        </div>
        {recentQuizzes.length ? (
          <div className="divide-y divide-ink/8">
            {recentQuizzes.map((q) => (
              <Link
                key={q._id}
                to={`/teacher/quizzes/${q._id}`}
                className="flex items-center justify-between py-3 hover:bg-paper-dim -mx-2 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{q.title}</p>
                  <p className="text-xs text-ink/40">{new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize
                    ${
                      q.status === 'live'
                        ? 'bg-green-100 text-green-600'
                        : q.status === 'expired'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {q.status === 'live' && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                  {q.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon="🗂️" title="No quizzes yet" description="Create your first quiz manually or with AI." />
        )}
      </div> */}
    </DashboardLayout>
  );
};

export default TeacherDashboard;