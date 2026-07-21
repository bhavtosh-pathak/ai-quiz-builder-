import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { attemptService } from '../../services/attemptService';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import quizLogo from './quiz_builder.png';

const QuizResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(null); // questionId currently being explained
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    attemptService
      .getById(id)
      .then(({ attempt: a }) => setAttempt(a))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const getExplanation = async (answer) => {
    const question = attempt.quiz.questions.find((q) => q._id === answer.questionId);
    if (!question) return;
    setExplaining(answer.questionId);
    try {
      const res = await aiService.explain({
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
      });
      setExplanations((e) => ({ ...e, [answer.questionId]: res.explanation }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setExplaining(null);
    }
  };
  const getImageBase64 = (image) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
  });
};

  const downloadCertificate = async() => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();


  // Background
  doc.setFillColor(248, 246, 240);
  doc.rect(0, 0, pageWidth, pageHeight, "F");


  // Outer border
  doc.setDrawColor(30, 35, 45);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);


  // Inner gold border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);



  // Logo Circle
   const logo = await getImageBase64(quizLogo);

  doc.addImage(
    logo,
    "PNG",
    pageWidth / 2 - 35,
    20,
    70,
    25
  );



  // Title
  doc.setTextColor(20,22,31);
  doc.setFont("times", "bold");
  doc.setFontSize(30);

  doc.text(
    "Certificate of Achievement",
    pageWidth / 2,
    60,
    {align:"center"}
  );



  // Subtitle
  doc.setFont("times","normal");
  doc.setFontSize(15);

  doc.text(
    "This certificate is proudly presented to",
    pageWidth / 2,
    78,
    {align:"center"}
  );



  // Student Name
  doc.setFont("times","bold");
  doc.setFontSize(26);
  doc.setTextColor(180,130,20);

  doc.text(
    user.name,
    pageWidth / 2,
    95,
    {align:"center"}
  );



  // Description
  doc.setTextColor(20,22,31);
  doc.setFont("times","normal");
  doc.setFontSize(15);


  doc.text(
    `for successfully completing the quiz`,
    pageWidth / 2,
    112,
    {align:"center"}
  );


  doc.setFont("times","bold");

  doc.text(
    `"${attempt.quiz.title}"`,
    pageWidth / 2,
    125,
    {align:"center"}
  );



  // Score Box
  doc.setFillColor(20,22,31);
  doc.roundedRect(
    pageWidth/2 - 45,
    138,
    90,
    22,
    5,
    5,
    "F"
  );


  doc.setTextColor(255,255,255);
  doc.setFontSize(14);

  doc.text(
    `Score : ${attempt.score}/${attempt.totalMarks}  |  ${attempt.percentage}%`,
    pageWidth/2,
    152,
    {
      align:"center"
    }
  );



  // Footer Date
  doc.setTextColor(80,80,80);
  doc.setFontSize(11);

  doc.text(
    `Issued on ${new Date(attempt.submittedAt).toLocaleDateString()}`,
    35,
    pageHeight-30
  );



  // Digital signature (stylized script) — sits just above the signature line
  doc.setFont("times", "italic");
  doc.setFontSize(18);
  doc.setTextColor(30, 35, 45);
  doc.text(
    "Bhavtosh Pathak",
    pageWidth-58,
    pageHeight-38,
    {
      align:"center"
    }
  );

  // Signature line
  doc.setDrawColor(30, 35, 45);
  doc.line(
    pageWidth-80,
    pageHeight-35,
    pageWidth-35,
    pageHeight-35
  );

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(20,22,31);
  doc.text(
    "Bhavtosh Pathak",
    pageWidth-58,
    pageHeight-30,
    {
      align:"center"
    }
  );


  // Certificate ID
  doc.setFontSize(9);
  doc.text(
    `Certificate ID: QUIZ-${attempt._id.slice(-8).toUpperCase()}`,
    pageWidth/2,
    pageHeight-30,
    {
      align:"center"
    }
  );



  doc.save(
    `AI_Quiz_Certificate_${user.name}.pdf`
  );
};




  if (loading) return <DashboardLayout><Loader label="Loading result..." /></DashboardLayout>;
  if (!attempt) return <DashboardLayout><EmptyState icon="🚫" title="Attempt not found" /></DashboardLayout>;

  const passed = attempt.percentage >= 40;
return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="surface overflow-hidden">
          <div className="bg-ink px-6 py-8 text-center text-paper">
            <p className="section-eyebrow !text-gold-400 justify-center flex">{attempt.quiz.title}</p>
            <p className="mt-3 font-display text-5xl font-semibold">{attempt.percentage}%</p>
            <p className="mt-1 font-mono text-sm text-paper/50">
              {attempt.score} / {attempt.totalMarks} marks
              {/* {location.state?.rank && ` · Rank #${location.state.rank}`} */}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-ink/8 border-b border-ink/8 text-center">
            <div className="p-4">
              <p className="font-mono text-xl font-semibold text-success">{attempt.correctCount}</p>
              <p className="text-xs text-ink/45">Correct</p>
            </div>
            <div className="p-4">
              <p className="font-mono text-xl font-semibold text-danger">{attempt.wrongCount}</p>
              <p className="text-xs text-ink/45">Wrong</p>
            </div>
            <div className="p-4">
              <p className="font-mono text-xl font-semibold text-ink/50">{attempt.skippedCount}</p>
              <p className="text-xs text-ink/45">Skipped</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-6 py-4">
            {passed && (
              <button onClick={downloadCertificate} className="btn-gold text-sm">
                🏆 Download certificate
              </button>
            )}
            <Link to="/student/quizzes" className="btn-primary text-sm ml-auto">
              Find another quiz
            </Link>
          </div>
        </div>

        <div className="surface mt-6 divide-y divide-ink/8 overflow-hidden">
          <p className="section-eyebrow px-6 py-4">Review your answers</p>
          {attempt.answers.map((a) => {
            const question = attempt.quiz.questions.find((q) => q._id === a.questionId);
            if (!question) return null;
            return (
              <div key={a.questionId} className="px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-sm">{question.questionText}</p>
                  <span className={a.isCorrect ? 'badge-easy shrink-0' : 'badge-hard shrink-0'}>
                    {a.isCorrect ? 'Correct' : a.selectedOption ? 'Wrong' : 'Skipped'}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((opt, i) => {
                    const isCorrectOpt = opt === a.correctAnswer;
                    const isSelected = opt === a.selectedOption;
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border px-3 py-2 text-xs ${
                          isCorrectOpt
                            ? 'border-success bg-success-light text-success'
                            : isSelected
                            ? 'border-danger bg-danger-light text-danger'
                            : 'border-ink/10 text-ink/50'
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {!a.isCorrect && (
                  <div className="mt-3 border-t border-ink/8 pt-3">
                    {explanations[a.questionId] ? (
                      <p className="text-xs text-ink/55">
                        <span className="font-semibold text-primary-500">AI explanation: </span>
                        {explanations[a.questionId]}
                      </p>
                    ) : (
                      <button
                        onClick={() => getExplanation(a)}
                        disabled={explaining === a.questionId}
                        className="text-xs font-semibold text-primary-500 hover:underline"
                      >
                        {explaining === a.questionId ? 'Thinking...' : '✨ Explain this answer with AI'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  )};
  export default QuizResult;