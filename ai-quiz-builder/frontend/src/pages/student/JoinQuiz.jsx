import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import { quizService } from '../../services/quizService';

const JoinQuiz = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.trim().length < 4) return toast.error('Enter the 6-character quiz code your teacher shared.');
    setJoining(true);
    try {
      await quizService.joinByCode(code.trim());
      navigate(`/student/attempt/${code.trim().toUpperCase()}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-md text-center pt-10">
        <p className="section-eyebrow justify-center flex">Join a live quiz</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Enter your quiz code</h1>
        <p className="mt-2 text-sm text-ink/50">Ask your teacher for the 6-character code shown on their screen.</p>

        <form onSubmit={handleSubmit} className="surface mt-8 p-6">
          <input
            autoFocus
            className="input text-center font-mono text-2xl tracking-[0.4em] uppercase"
            maxLength={6}
            placeholder="XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <button type="submit" disabled={joining} className="btn-primary w-full mt-4 !py-3">
            {joining ? 'Joining...' : 'Join quiz →'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JoinQuiz;
