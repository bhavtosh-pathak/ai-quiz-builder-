// import { useEffect, useMemo, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../layouts/DashboardLayout';
// import Timer from '../../components/Timer';
// import Loader from '../../components/Loader';
// import { quizService } from '../../services/quizService';
// import { attemptService } from '../../services/attemptService';
// import { useSocket } from '../../context/SocketContext';

// const shuffleArray = (arr) => {
//   const result = [...arr];
//   for (let i = result.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// };

// const QuizAttempt = () => {
//   const { code } = useParams();
//   const navigate = useNavigate();
//   const { socket, connected } = useSocket();

//   const [quiz, setQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({}); // questionId -> selectedOption
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const startedAtRef = useRef(null);
//   const submittedRef = useRef(false);

//   useEffect(() => {
//     quizService
//       .joinByCode(code)
//       .then(({ quiz: q }) => {
//         setQuiz(q);
//         let qs = q.questions;
//         if (q.shuffleQuestions) qs = shuffleArray(qs);
//         if (q.shuffleOptions) qs = qs.map((question) => ({ ...question, options: shuffleArray(question.options) }));
//         setQuestions(qs);
//         startedAtRef.current = new Date().toISOString();
//       })
//       .catch((err) => {
//         toast.error(err.message);
//         navigate('/student/quizzes');
//       })
//       .finally(() => setLoading(false));
//   }, [code, navigate]);


//   useEffect(() => {

//   const handleVisibilityChange = () => {

//     if (document.hidden) {

//       setTabSwitchCount((prev) => prev + 1);

//       toast.error(
//         "Warning: Do not switch tabs during quiz!"
//       );

//       // teacher ko live update bhejna
//       if (socket && connected && quiz) {
//         socket.emit("quiz:cheating", {
//           quizId: quiz._id,
//           type: "TAB_SWITCH"
//         });
//       }

//     }

//   };


//   document.addEventListener(
//     "visibilitychange",
//     handleVisibilityChange
//   );


//   return () => {

//     document.removeEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );

//   };


// }, [socket, connected, quiz]);
//   useEffect(() => {
//     if (!socket || !connected || !quiz) return undefined;
//     socket.emit('room:join', { quizId: quiz._id });
//     return () => socket.emit('room:leave', { quizId: quiz._id });
//   }, [socket, connected, quiz]);

//   const answeredCount = Object.keys(answers).length;

//   // Let the teacher's live view see rough progress
//   useEffect(() => {
//     if (!socket || !connected || !quiz) return;
//     socket.emit('quiz:progress', { quizId: quiz._id, answeredCount, totalQuestions: questions.length });
//   }, [answeredCount, socket, connected, quiz, questions.length]);

//   const selectAnswer = (questionId, option) => setAnswers((a) => ({ ...a, [questionId]: option }));

//   const handleSubmit = async (autoSubmitted = false) => {
//     if (submittedRef.current) return;
//     submittedRef.current = true;
//     setSubmitting(true);

//     const payload = {
//       startedAt: startedAtRef.current,
//       autoSubmitted,
//       answers: questions.map((q) => ({ questionId: q._id, selectedOption: answers[q._id] ?? null })),
//     };

//     try {
//       const res = await attemptService.submit(quiz._id, payload);
//       toast.success(autoSubmitted ? "Time's up — your quiz was submitted automatically" : 'Quiz submitted!');
//       navigate(`/student/results/${res.attempt._id}`, { state: { rank: res.rank } });
//     } catch (err) {
//       toast.error(err.message);
//       submittedRef.current = false;
//       setSubmitting(false);
//     }
//   };

//   const question = questions[current];
//   const progressPct = useMemo(
//     () => (questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0),
//     [current, questions.length]
//   );

//   if (loading) return <DashboardLayout><Loader label="Loading quiz..." /></DashboardLayout>;
//   if (!quiz || !question) return null;

//   return (
//     <DashboardLayout>
//       <div className="mx-auto max-w-3xl">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <p className="section-eyebrow">{quiz.subject}</p>
//             <h1 className="font-display text-2xl font-semibold tracking-tight">{quiz.title}</h1>
//           </div>
//           <Timer durationSeconds={quiz.duration * 60} onExpire={() => handleSubmit(true)} />
//         </div>

//         {/* Progress bar */}
//         <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
//           <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
//         </div>

//         <div className="flex items-center justify-between mb-3 text-xs font-mono text-ink/45">
//           <span>Question {current + 1} of {questions.length}</span>
//           <span>{answeredCount} answered</span>
//         </div>

//         <div className="surface p-6 animate-fade-up" key={question._id}>
//           <p className="font-display text-xl leading-snug mb-6">{question.questionText}</p>
//           <div className="space-y-3">
//             {question.options.map((opt, i) => (
//               <label
//                 key={i}
//                 className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
//                   answers[question._id] === opt
//                     ? 'border-primary-400 bg-primary-50'
//                     : 'border-ink/12 hover:border-ink/25'
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name={question._id}
//                   checked={answers[question._id] === opt}
//                   onChange={() => selectAnswer(question._id, opt)}
//                   className="accent-primary-500"
//                 />
//                 <span className="text-sm">{opt}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 flex items-center justify-between gap-3">
//           <button
//             className="btn-secondary"
//             disabled={current === 0}
//             onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//           >
//             ← Previous
//           </button>

//           <div className="flex flex-wrap justify-center gap-1.5">
//             {questions.map((q, i) => (
//               <button
//                 key={q._id}
//                 onClick={() => setCurrent(i)}
//                 className={`h-7 w-7 rounded-full text-xs font-mono font-semibold transition-colors ${
//                   i === current
//                     ? 'bg-primary-500 text-white'
//                     : answers[q._id]
//                     ? 'bg-success-light text-success'
//                     : 'bg-ink/8 text-ink/40'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>

//           {current < questions.length - 1 ? (
//             <button className="btn-primary" onClick={() => setCurrent((c) => c + 1)}>
//               Next →
//             </button>
//           ) : (
//             <button className="btn-gold" disabled={submitting} onClick={() => handleSubmit(false)}>
//               {submitting ? 'Submitting...' : 'Submit quiz'}
//             </button>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default QuizAttempt;


// new files 


import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import Timer from '../../components/Timer';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { quizService } from '../../services/quizService';
import { attemptService } from '../../services/attemptService';
import { useSocket } from '../../context/SocketContext';
import { useProctoring } from '../../hooks/useProctoring';

const shuffleArray = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const QuizAttempt = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // questionId -> selectedOption
  const [flagged, setFlagged] = useState(() => new Set()); // questionIds marked for review
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justAnswered, setJustAnswered] = useState(false);
  const [started, setStarted] = useState(false); // gated behind the proctoring notice screen
  const startedAtRef = useRef(null);
  const submittedRef = useRef(false);
  const autoSubmitReasonRef = useRef('timeout');
  const answersRef = useRef(answers);
  const violationsRef = useRef([]);
  const exitFullscreenRef = useRef(null);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    quizService
      .joinByCode(code)
      .then(({ quiz: q }) => {
        setQuiz(q);
        let qs = q.questions;
        if (q.shuffleQuestions) qs = shuffleArray(qs);
        if (q.shuffleOptions) qs = qs.map((question) => ({ ...question, options: shuffleArray(question.options) }));
        setQuestions(qs);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate('/student/quizzes');
      })
      .finally(() => setLoading(false));
  }, [code, navigate]);

  useEffect(() => {
    if (!socket || !connected || !quiz) return undefined;
    socket.emit('room:join', { quizId: quiz._id });
    return () => socket.emit('room:leave', { quizId: quiz._id });
  }, [socket, connected, quiz]);

  const answeredCount = Object.keys(answers).length;

  // Let the teacher's live view see rough progress
  useEffect(() => {
    if (!socket || !connected || !quiz || !started) return;
    socket.emit('quiz:progress', { quizId: quiz._id, answeredCount, totalQuestions: questions.length });
  }, [answeredCount, socket, connected, quiz, questions.length, started]);

  const question = questions[current];

  const selectAnswer = useCallback((questionId, option) => {
    setAnswers((a) => ({ ...a, [questionId]: option }));
    setJustAnswered(true);
    setTimeout(() => setJustAnswered(false), 350);
  }, []);

  const toggleFlag = useCallback((questionId) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const goNext = useCallback(() => setCurrent((c) => Math.min(questions.length - 1, c + 1)), [questions.length]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);

  const doSubmit = useCallback(
    async (autoSubmitted = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      setConfirmOpen(false);
      exitFullscreenRef.current?.();

      const currentAnswers = answersRef.current;
      const payload = {
        startedAt: startedAtRef.current,
        autoSubmitted,
        autoSubmitReason: autoSubmitted ? autoSubmitReasonRef.current : null,
        answers: questions.map((q) => ({ questionId: q._id, selectedOption: currentAnswers[q._id] ?? null })),
        violations: violationsRef.current,
      };

      try {
        const res = await attemptService.submit(quiz._id, payload);
        toast.success(
          autoSubmitted
            ? autoSubmitReasonRef.current === 'cheating'
              ? 'Quiz auto-submitted due to repeated proctoring violations'
              : "Time's up — your quiz was submitted automatically"
            : 'Quiz submitted!'
        );
        navigate(`/student/results/${res.attempt._id}`, { state: { rank: res.rank } });
      } catch (err) {
        toast.error(err.message);
        submittedRef.current = false;
        setSubmitting(false);
      }
    },
    [questions, quiz, navigate]
  );

  const handleMaxViolations = useCallback(
    (allViolations) => {
      autoSubmitReasonRef.current = 'cheating';
      toast.error('Too many proctoring violations — submitting your quiz now.');
      doSubmit(true);
    },
    [doSubmit]
  );

  const { violations, violationCount, maxViolations, requestFullscreen, exitFullscreen, containerProps, violationMessage } =
    useProctoring({
      active: started,
      socket,
      connected,
      quizId: quiz?._id,
      onMaxViolations: handleMaxViolations,
    });

  useEffect(() => {
    violationsRef.current = violations;
  }, [violations]);
  useEffect(() => {
    exitFullscreenRef.current = exitFullscreen;
  }, [exitFullscreen]);

  // Warn (but don't yet auto-submit) on every violation short of the max
  const prevViolationCountRef = useRef(0);
  useEffect(() => {
    if (violationCount > prevViolationCountRef.current && violationCount < maxViolations) {
      const latest = violations[violations.length - 1];
      toast(
        `⚠️ ${violationMessage(latest.type)} — warning ${violationCount}/${maxViolations}`,
        { icon: '🛡️', style: { border: '1px solid #E3B341' } }
      );
    }
    prevViolationCountRef.current = violationCount;
  }, [violationCount, maxViolations, violations, violationMessage]);

  const requestSubmit = () => setConfirmOpen(true);

  const beginQuiz = async () => {
    await requestFullscreen();
    startedAtRef.current = new Date().toISOString();
    setStarted(true);
  };

  // Keyboard shortcuts: 1-4 select an option, arrows navigate, F flags
  useEffect(() => {
    if (!started || !question || confirmOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (question.options[idx] !== undefined) selectAnswer(question._id, question.options[idx]);
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFlag(question._id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [started, question, confirmOpen, selectAnswer, goNext, goPrev, toggleFlag]);

  const progressPct = useMemo(
    () => (questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0),
    [current, questions.length]
  );

  if (loading) return <DashboardLayout><Loader label="Loading quiz..." /></DashboardLayout>;
  if (!quiz || !question) return null;

  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flagged.size;

  // --- Pre-quiz proctoring notice ---
  if (!started) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-lg">
          <div className="surface overflow-hidden">
            <div className="bg-ink px-6 py-6 text-paper">
              <p className="section-eyebrow !text-gold-400">Before you begin</p>
              <h1 className="mt-1 font-display text-2xl font-semibold">{quiz.title}</h1>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-ink/70 mb-3">🛡️ This quiz is proctored</p>
              <ul className="space-y-2 text-sm text-ink/60">
                <li>• The quiz will open in fullscreen — please don't exit it.</li>
                <li>• Switching tabs or windows counts as a violation.</li>
                <li>• Copying question text is disabled.</li>
                <li>
                  • After <strong>{maxViolations} warnings</strong>, your quiz is auto-submitted immediately.
                </li>
              </ul>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-mono text-ink/45">
                <div className="surface !shadow-none p-3">
                  <p className="text-ink text-base font-semibold">{questions.length}</p>
                  questions
                </div>
                <div className="surface !shadow-none p-3">
                  <p className="text-ink text-base font-semibold">{quiz.duration}</p>
                  minutes
                </div>
                <div className="surface !shadow-none p-3">
                  <p className="text-ink text-base font-semibold">{quiz.totalMarks}</p>
                  marks
                </div>
              </div>
              <button onClick={beginQuiz} className="btn-gold w-full mt-6 !py-3">
                Enter fullscreen & start quiz →
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl" {...containerProps}>
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <p className="section-eyebrow">{quiz.subject}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight truncate">{quiz.title}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              title="Proctoring active"
              className={`hidden sm:flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs font-semibold ${
                violationCount > 0
                  ? 'border-gold-300 bg-gold-50 text-gold-600'
                  : 'border-success/30 bg-success-light text-success'
              }`}
            >
              🛡️ {violationCount}/{maxViolations}
            </span>
            <Timer durationSeconds={quiz.duration * 60} onExpire={() => doSubmit(true)} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
          <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center justify-between mb-3 text-xs font-mono text-ink/45">
          <span>Question {current + 1} of {questions.length}</span>
          <span className="flex items-center gap-3">
            {flaggedCount > 0 && <span className="text-gold-500">{flaggedCount} flagged</span>}
            <span>{answeredCount} answered</span>
          </span>
        </div>

        <div className="surface p-6 animate-fade-up" key={question._id}>
          <div className="flex items-start justify-between gap-3 mb-6">
            <p className="font-display text-xl leading-snug select-none">{question.questionText}</p>
            <button
              onClick={() => toggleFlag(question._id)}
              title="Mark for review (F)"
              className={`shrink-0 grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
                flagged.has(question._id)
                  ? 'border-gold-300 bg-gold-50 text-gold-600'
                  : 'border-ink/12 text-ink/30 hover:border-ink/25 hover:text-ink/50'
              }`}
            >
              {flagged.has(question._id) ? '🚩' : '⚑'}
            </button>
          </div>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = answers[question._id] === opt;
              return (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-all duration-150 select-none ${
                    isSelected
                      ? `border-primary-400 bg-primary-50 ${justAnswered ? 'scale-[1.01]' : ''}`
                      : 'border-ink/12 hover:border-ink/25'
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold ${
                      isSelected ? 'border-primary-500 bg-primary-500 text-white' : 'border-ink/20 text-ink/40'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <input
                    type="radio"
                    name={question._id}
                    checked={isSelected}
                    onChange={() => selectAnswer(question._id, opt)}
                    className="sr-only"
                  />
                  <span className="text-sm">{opt}</span>
                  {isSelected && <span className="ml-auto text-primary-500">✓</span>}
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink/35 font-mono">Tip: press 1–4 to answer, ← → to navigate, F to flag</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button className="btn-secondary" disabled={current === 0} onClick={goPrev}>
            ← Previous
          </button>

          <div className="flex flex-wrap justify-center gap-1.5">
            {questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => setCurrent(i)}
                title={flagged.has(q._id) ? 'Flagged for review' : undefined}
                className={`relative h-7 w-7 rounded-full text-xs font-mono font-semibold transition-colors ${
                  i === current
                    ? 'bg-primary-500 text-white'
                    : answers[q._id]
                    ? 'bg-success-light text-success'
                    : 'bg-ink/8 text-ink/40'
                }`}
              >
                {i + 1}
                {flagged.has(q._id) && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold-400 ring-2 ring-paper" />
                )}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button className="btn-primary" onClick={goNext}>
              Next →
            </button>
          ) : (
            <button className="btn-gold" disabled={submitting} onClick={requestSubmit}>
              {submitting ? 'Submitting...' : 'Submit quiz'}
            </button>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Submit this quiz?"
        confirmLabel={submitting ? 'Submitting...' : 'Submit now'}
        confirmVariant="gold"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => doSubmit(false)}
      >
        <p>
          You've answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
        </p>
        {unansweredCount > 0 && <p className="mt-1 text-danger">{unansweredCount} question(s) are still unanswered.</p>}
        {flaggedCount > 0 && <p className="mt-1 text-gold-600">{flaggedCount} question(s) are flagged for review.</p>}
        <p className="mt-2 text-xs text-ink/40">Once submitted, you can't change your answers.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default QuizAttempt;
