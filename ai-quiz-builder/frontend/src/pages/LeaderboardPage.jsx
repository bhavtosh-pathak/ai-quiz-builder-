import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LeaderboardTable from '../components/LeaderboardTable';
import Loader from '../components/Loader';
import QuizCodeTicket from '../components/QuizCodeTicket';
import { useLiveQuizRoom } from '../hooks/useLiveQuizRoom';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

const LeaderboardPage = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const { leaderboard, participantCount, loading, isLive } = useLiveQuizRoom(quizId);

  useEffect(() => {
    quizService.getById(quizId).then(({ quiz: q }) => setQuiz(q)).catch(() => {});
  }, [quizId]);

  const myEntry = leaderboard.find((row) => row.studentId === user.id);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow">Live leaderboard</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{quiz?.title || 'Quiz'}</h1>
            <p className="mt-1 text-sm text-ink/45">{participantCount} in the room right now</p>
          </div>
          {quiz?.quizCode && <QuizCodeTicket code={quiz.quizCode} />}
        </div>

        {myEntry && (
          <div className="surface mb-6 flex items-center justify-between bg-primary-50 px-5 py-4 border-primary-200">
            <p className="text-sm font-semibold text-primary-700">Your rank</p>
            <p className="font-mono text-2xl font-bold text-primary-600">#{myEntry.rank}</p>
          </div>
        )}

        {loading ? <Loader /> : <LeaderboardTable leaderboard={leaderboard} highlightStudentId={user.id} isLive={isLive} />}
      </div>
    </DashboardLayout>
  );
};

export default LeaderboardPage;
