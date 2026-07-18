// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import jsPDF from 'jspdf';
// import DashboardLayout from '../../layouts/DashboardLayout';
// import LeaderboardTable from '../../components/LeaderboardTable';
// import Loader from '../../components/Loader';
// import EmptyState from '../../components/EmptyState';
// import { useLiveQuizRoom } from '../../hooks/useLiveQuizRoom';
// import { quizService } from '../../services/quizService';
// import { attemptService } from '../../services/attemptService';

// const QuizResults = () => {
//   const { id } = useParams();
//   const [quiz, setQuiz] = useState(null);
//   const [attempts, setAttempts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { leaderboard, participantCount, isLive } = useLiveQuizRoom(id);

//   useEffect(() => {
//     Promise.all([quizService.getById(id), attemptService.getQuizAttempts(id)])
//       .then(([quizRes, attemptRes]) => {
//         setQuiz(quizRes.quiz);
//         setAttempts(attemptRes.attempts);
//       })
//       .catch((err) => toast.error(err.message))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const exportPdf = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(quiz.title, 14, 18);
//     doc.setFontSize(10);
//     doc.text(`Quiz code: ${quiz.quizCode}  |  Total marks: ${quiz.totalMarks}`, 14, 25);

//     let y = 38;
//     doc.setFontSize(11);
//     doc.text('Rank', 14, y);
//     doc.text('Student', 34, y);
//     doc.text('Score', 130, y);
//     doc.text('Percentage', 160, y);
//     y += 6;
//     doc.setLineWidth(0.2);
//     doc.line(14, y - 4, 196, y - 4);

//     leaderboard.forEach((row) => {
//       if (y > 280) {
//         doc.addPage();
//         y = 20;
//       }
//       doc.text(String(row.rank), 14, y);
//       doc.text(row.studentName, 34, y);
//       doc.text(`${row.score}/${row.totalMarks}`, 130, y);
//       doc.text(`${row.percentage}%`, 160, y);
//       y += 7;
//     });

//     doc.save(`${quiz.title.replace(/\s+/g, '_')}_leaderboard.pdf`);
//   };

//   if (loading) return <DashboardLayout><Loader label="Loading results..." /></DashboardLayout>;
//   if (!quiz) return <DashboardLayout><EmptyState icon="🚫" title="Quiz not found" /></DashboardLayout>;

//   return (
//     <DashboardLayout>
//       <div className="flex flex-col gap-1 mb-6 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="section-eyebrow">Results & analytics</p>
//           <h1 className="font-display text-3xl font-semibold tracking-tight">{quiz.title}</h1>
//           <p className="mt-1 text-sm text-ink/45">
//             {participantCount > 0 ? `${participantCount} currently in the live room` : 'No one in the live room right now'}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Link to={`/teacher/quizzes/${id}`} className="btn-secondary text-sm">
//             Back to quiz
//           </Link>
//           <button onClick={exportPdf} disabled={!leaderboard.length} className="btn-primary text-sm">
//             Export PDF
//           </button>
//         </div>
//       </div>

//       <LeaderboardTable leaderboard={leaderboard} isLive={isLive} />

//       <div className="surface mt-6 p-5">
//         <p className="section-eyebrow mb-4">Per-question breakdown</p>
//         {attempts.length === 0 ? (
//           <p className="text-sm text-ink/45">No attempts submitted yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
//                   <th className="px-3 py-2">Student</th>
//                   <th className="px-3 py-2 text-right">Correct</th>
//                   <th className="px-3 py-2 text-right">Wrong</th>
//                   <th className="px-3 py-2 text-right">Skipped</th>
//                   <th className="px-3 py-2 text-right">Time taken</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attempts.map((a) => (
//                   <tr key={a._id} className="border-b border-ink/5 last:border-0">
//                     <td className="px-3 py-2.5 font-medium">{a.student?.name}</td>
//                     <td className="px-3 py-2.5 text-right font-mono text-success">{a.correctCount}</td>
//                     <td className="px-3 py-2.5 text-right font-mono text-danger">{a.wrongCount}</td>
//                     <td className="px-3 py-2.5 text-right font-mono text-ink/40">{a.skippedCount}</td>
//                     <td className="px-3 py-2.5 text-right font-mono text-ink/40">{a.durationTakenSeconds}s</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default QuizResults;

// new files 
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import DashboardLayout from '../../layouts/DashboardLayout';
import LeaderboardTable from '../../components/LeaderboardTable';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useLiveQuizRoom } from '../../hooks/useLiveQuizRoom';
import { quizService } from '../../services/quizService';
import { attemptService } from '../../services/attemptService';

const VIOLATION_LABELS = {
  tab_switch: 'Switched tabs',
  fullscreen_exit: 'Exited fullscreen',
  copy_attempt: 'Tried to copy',
  devtools_attempt: 'Tried devtools shortcut',
  submission_flagged: 'Submission flagged',
};

const QuizResults = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    leaderboard,
    participantCount,
    activeParticipants,
    cheatAlerts,
    isLive
  } = useLiveQuizRoom(id);
  const lastToastedAlertRef = useRef(null);

  // Ticks every 10s so the "quiz duration has ended" check below stays
  // accurate without needing a page reload while a teacher keeps this open.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // The quiz's live window — used to decide when the integrity-alerts panel
  // should disappear (once the quiz's duration has actually elapsed, not
  // when an individual student submits).
  const quizExpiresAt = quiz?.publishedAt
    ? new Date(quiz.publishedAt).getTime() + (quiz.duration || 0) * 60 * 1000
    : null;
  const quizDurationOver = quizExpiresAt ? now > quizExpiresAt : false;

  // The socket-driven `cheatAlerts` only covers events received while this
  // page has been open. A student who already cheated-and-submitted before
  // the teacher loaded this page would be missing from that list even
  // though their attempt record has the violations. Merge both sources —
  // live socket alerts win for a given student since they're more current.
  const combinedAlerts = (() => {
    const byStudent = new Map();

    attempts
      .filter((a) => (a.violationCount ?? 0) > 0)
      .forEach((a) => {
        const lastViolation = a.violations?.[a.violations.length - 1];
        byStudent.set(a.student?._id?.toString(), {
          studentId: a.student?._id?.toString(),
          studentName: a.student?.name,
          type: lastViolation?.type || 'submission_flagged',
          violationCount: a.violationCount,
          timestamp: lastViolation?.timestamp || a.submittedAt,
        });
      });

    // Live socket alerts overwrite the attempt-derived entry for the same
    // student, since they reflect the most up-to-date violation count/type.
    cheatAlerts.forEach((alert) => {
      const key = (alert.studentId || alert.studentName)?.toString();
      byStudent.set(key, alert);
    });

    return [...byStudent.values()].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  })();

  useEffect(() => {
    Promise.all([quizService.getById(id), attemptService.getQuizAttempts(id)])
      .then(([quizRes, attemptRes]) => {
        setQuiz(quizRes.quiz);
        setAttempts(attemptRes.attempts);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Pop a toast the moment a new live integrity alert comes in, so a
  // teacher watching this page notices without having to keep re-scanning
  // the panel below.
  useEffect(() => {
    if (!cheatAlerts.length) return;
    const latest = cheatAlerts[0];
    const key = `${latest.studentId || latest.studentName}-${latest.timestamp}`;
    if (lastToastedAlertRef.current === key) return;
    lastToastedAlertRef.current = key;
    toast(`🚨 ${latest.studentName}: ${VIOLATION_LABELS[latest.type] || latest.type}`, {
      style: { border: '1px solid #D6455D' },
    });
  }, [cheatAlerts]);

  const exportExcel = () => {
    // Map studentId -> their attempt, so we can pull flagged/violations info
    // into the leaderboard rows below (leaderboard itself doesn't carry that).
    const attemptByStudentId = new Map(
      attempts.map((a) => [a.student?._id?.toString(), a])
    );

    const violationTypesText = (a) => {
      if (!a || !a.violations?.length) return '-';
      const labels = a.violations.map((v) => VIOLATION_LABELS[v.type] || v.type);
      return [...new Set(labels)].join(', ');
    };

    // Sheet 1 — leaderboard (rank, student, correct answers, percentage).
    // "Correct" always shows the student's real correct-answer count. But
    // if they had ANY suspicious activity during the attempt (tab switch,
    // fullscreen exit, etc.), their Percentage is zeroed out here — the
    // "Cheating Alert Type" column lists what was flagged.
    const leaderboardRows = leaderboard.map((row) => {
      const attempt = attemptByStudentId.get(row.studentId?.toString());
      const correctCount = attempt?.correctCount ?? 0;
      const totalQuestions = attempt?.answers?.length ?? quiz.questions?.length ?? 0;
      const hasSuspiciousActivity = (attempt?.violationCount ?? 0) > 0;

      return {
        Rank: row.rank,
        Student: row.studentName,
        Correct: `${correctCount}/${totalQuestions}`,
        'Percentage (%)': hasSuspiciousActivity ? 0 : row.percentage,
        'Cheating Alert Type': violationTypesText(attempt),
      };
    });

    const workbook = XLSX.utils.book_new();
    const leaderboardSheet = XLSX.utils.json_to_sheet(leaderboardRows);
    leaderboardSheet['!cols'] = [{ wch: 8 }, { wch: 24 }, { wch: 12 }, { wch: 14 }, { wch: 32 }];
    XLSX.utils.book_append_sheet(workbook, leaderboardSheet, 'Leaderboard');

    // Sheet 2 — per-question breakdown (correct/wrong/skipped/time/integrity)
    if (attempts.length) {
      const breakdownRows = attempts.map((a) => ({
        Student: a.student?.name || '',
        Correct: a.correctCount,
        Wrong: a.wrongCount,
        Skipped: a.skippedCount,
        'Time taken (s)': a.durationTakenSeconds,
        Integrity: a.flagged
          ? `Flagged (${a.violationCount})`
          : a.violationCount > 0
          ? `${a.violationCount} warning${a.violationCount > 1 ? 's' : ''}`
          : '-',
        'Cheating Alert Type': violationTypesText(a),
      }));
      const breakdownSheet = XLSX.utils.json_to_sheet(breakdownRows);
      breakdownSheet['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 18 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(workbook, breakdownSheet, 'Breakdown');
    }

    XLSX.writeFile(workbook, `${quiz.title.replace(/\s+/g, '_')}_results.xlsx`);
  };

  if (loading) return <DashboardLayout><Loader label="Loading results..." /></DashboardLayout>;
  if (!quiz) return <DashboardLayout><EmptyState icon="🚫" title="Quiz not found" /></DashboardLayout>;

  const flaggedCount = attempts.filter((a) => a.flagged).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Results & analytics</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{quiz.title}</h1>
          <p className="mt-1 text-sm text-ink/45">
            {participantCount > 0 ? `${participantCount} currently in the live room` : 'No one in the live room right now'}
            {flaggedCount > 0 && <span className="text-danger"> · {flaggedCount} flagged for integrity review</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/teacher/quizzes/${id}`} className="btn-secondary text-sm">
            Back to quiz
          </Link>
          <button onClick={exportExcel} disabled={!leaderboard.length} className="btn-primary text-sm">
            Export Excel
          </button>
        </div>
      </div>

      <div className="surface mb-6 p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="section-eyebrow">LIVE PARTICIPANTS</p>
          <span className="badge-medium">{participantCount} Online</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {activeParticipants.map((student) => (
            <div
              key={student.studentId}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink/5"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                {student.studentName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-medium">{student.studentName}</p>
                <p className="text-xs text-success">● Attempting</p>
              </div>
            </div>
          ))}

          {activeParticipants.length === 0 && (
            <p className="text-sm text-ink/40">No students joined yet</p>
          )}
        </div>
      </div>

      {combinedAlerts.length > 0 && !quizDurationOver && (
        <div className="surface mb-6 border-danger/30 bg-danger-light overflow-hidden">
          <div className="flex items-center justify-between border-b border-danger/20 px-5 py-3">
            <p className="section-eyebrow !text-danger">🚨 Live integrity alerts</p>
            <span className="font-mono text-xs text-danger">{combinedAlerts.length} flagged</span>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-danger/10">
            {combinedAlerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span className="font-medium text-ink">{a.studentName}</span>
                <span className="text-ink/60">
                  {VIOLATION_LABELS[a.type] || a.type}
                  {a.violationCount > 1 ? ` (${a.violationCount} total)` : ''}
                </span>
                <span className="font-mono text-xs text-ink/40">
                  {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <LeaderboardTable leaderboard={leaderboard} isLive={isLive} />

      <div className="surface mt-6 p-5">
        <p className="section-eyebrow mb-4">Per-question breakdown</p>
        {attempts.length === 0 ? (
          <p className="text-sm text-ink/45">No attempts submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2 text-right">Correct</th>
                  <th className="px-3 py-2 text-right">Wrong</th>
                  <th className="px-3 py-2 text-right">Skipped</th>
                  <th className="px-3 py-2 text-right">Time taken</th>
                  <th className="px-3 py-2 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a._id} className="border-b border-ink/5 last:border-0">
                    <td className="px-3 py-2.5 font-medium">{a.student?.name}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-success">{a.correctCount}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-danger">{a.wrongCount}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-ink/40">{a.skippedCount}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-ink/40">{a.durationTakenSeconds}s</td>
                    <td className="px-3 py-2.5 text-right">
                      {a.flagged ? (
                        <span
                          className="badge-hard"
                          title={`${a.violationCount} proctoring violation(s)`}
                        >
                          ⚠ Flagged
                        </span>
                      ) : a.violationCount > 0 ? (
                        <span className="badge-medium" title={`${a.violationCount} proctoring violation(s)`}>
                          {a.violationCount} warning{a.violationCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-ink/25 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizResults;