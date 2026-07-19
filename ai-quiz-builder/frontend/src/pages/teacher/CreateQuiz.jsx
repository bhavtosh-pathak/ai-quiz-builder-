import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import QuestionEditor from '../../components/QuestionEditor';
import Loader from '../../components/Loader';
import QuizCodeTicket from '../../components/QuizCodeTicket';
import { quizService } from '../../services/quizService';

const blankQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  difficulty: 'medium',
  explanation: '',
  marks: 1,
  source: 'manual',
});

const CreateQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const isNew = !isEditing;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [quizMeta, setQuizMeta] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 15,
    negativeMarking: { enabled: false, value: 0.25 },
    shuffleQuestions: false,
    shuffleOptions: false,
  });
  const [questions, setQuestions] = useState(location.state?.aiQuestions || []);
  const [status, setStatus] = useState('draft');
  const [quizCode, setQuizCode] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    quizService
      .getById(id)
      .then(({ quiz }) => {
        setQuizMeta({
          title: quiz.title,
          description: quiz.description,
          subject: quiz.subject,
          duration: quiz.duration,
          negativeMarking: quiz.negativeMarking,
          shuffleQuestions: quiz.shuffleQuestions,
          shuffleOptions: quiz.shuffleOptions,
        });
        setQuestions(quiz.questions);
        setStatus(quiz.status);
        setQuizCode(quiz.status !== 'draft' ? quiz.quizCode : null);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const isLocked = status === 'published';

  const updateQuestion = (index, updated) => {
    setQuestions((qs) => qs.map((q, i) => (i === index ? updated : q)));
  };

  const removeQuestion = async (index) => {
    const q = questions[index];
    if (isEditing && q._id) {
      try {
        await quizService.deleteQuestion(id, q._id);
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  };

  const addQuestion = () => setQuestions((qs) => [...qs, blankQuestion()]);

  const validateQuestions = () => {
    for (const q of questions) {
      if (!q.questionText.trim()) return 'Every question needs question text.';
      if (q.options.some((o) => !o.trim())) return 'Every option must be filled in.';
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) return 'Mark a correct answer for every question.';
    }
    return null;
  };

  const handleSave = async (publish = false) => {
    if (!quizMeta.title.trim()) return toast.error('Give your quiz a title first.');
    if (publish) {
      const err = validateQuestions();
      if (err) return toast.error(err);
      if (questions.length === 0) return toast.error('Add at least one question before publishing.');
    }

    setSaving(true);
    try {
      let quiz;
      if (isNew) {
        const res = await quizService.create({ ...quizMeta, questions });
        quiz = res.quiz;
      } else {
        const res = await quizService.update(id, { ...quizMeta, questions });
        quiz = res.quiz;
      }

      if (publish) {
        const res = await quizService.publish(quiz._id);
        quiz = res.quiz;
        toast.success('Quiz published! Share the code with your students.');
      } else {
        toast.success('Quiz saved as draft');
      }

      navigate(`/teacher/quizzes/${quiz._id}`, { replace: true });
      setStatus(quiz.status);
      setQuizCode(quiz.status !== 'draft' ? quiz.quizCode : null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><Loader label="Loading quiz..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">{isNew ? 'New quiz' : isLocked ? 'View quiz' : 'Edit quiz'}</p>
          <h1 className="font-sans text-3xl font-semibold tracking-tight">
            {quizMeta.title || 'Untitled quiz'}
          </h1>
        </div>
        {quizCode && <QuizCodeTicket code={quizCode} />}
      </div>

      {isLocked && (
        <div className="surface mb-6 border-gold-300 bg-gold-50 p-4 text-sm text-gold-600">
          This quiz is published and locked from editing. Close it first if you need to make changes.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meta form */}
        <div className="surface p-5 space-y-4 lg:col-span-1 h-fit">
          <p className="section-eyebrow">Quiz details</p>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              disabled={isLocked}
              value={quizMeta.title}
              onChange={(e) => setQuizMeta({ ...quizMeta, title: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Subject</label>
            <input
              className="input"
              disabled={isLocked}
              placeholder="e.g. Data Structures"
              value={quizMeta.subject}
              onChange={(e) => setQuizMeta({ ...quizMeta, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              className="input"
              disabled={isLocked}
              value={quizMeta.duration}
              onChange={(e) => setQuizMeta({ ...quizMeta, duration: Number(e.target.value) })}
            />
          </div>

          <label className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-2.5">
            <span className="text-sm">Shuffle questions</span>
            <input
              type="checkbox"
              disabled={isLocked}
              checked={quizMeta.shuffleQuestions}
              onChange={(e) => setQuizMeta({ ...quizMeta, shuffleQuestions: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-2.5">
            <span className="text-sm">Shuffle options</span>
            <input
              type="checkbox"
              disabled={isLocked}
              checked={quizMeta.shuffleOptions}
              onChange={(e) => setQuizMeta({ ...quizMeta, shuffleOptions: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-2.5">
            <span className="text-sm">Negative marking</span>
            <input
              type="checkbox"
              disabled={isLocked}
              checked={quizMeta.negativeMarking.enabled}
              onChange={(e) =>
                setQuizMeta({ ...quizMeta, negativeMarking: { ...quizMeta.negativeMarking, enabled: e.target.checked } })
              }
            />
          </label>
          {quizMeta.negativeMarking.enabled && (
            <div>
              <label className="label">Marks deducted per wrong answer</label>
              <input
                type="number"
                step={0.25}
                min={0}
                className="input"
                disabled={isLocked}
                value={quizMeta.negativeMarking.value}
                onChange={(e) =>
                  setQuizMeta({
                    ...quizMeta,
                    negativeMarking: { ...quizMeta.negativeMarking, value: Number(e.target.value) },
                  })
                }
              />
            </div>
          )}

          {!isLocked && (
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary w-full">
                Save draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-gold w-full">
                {saving ? 'Publishing...' : 'Publish quiz'}
              </button>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-eyebrow">Questions ({questions.length})</p>
            {!isLocked && (
              <button onClick={addQuestion} className="btn-secondary !py-1.5 !px-3 text-xs">
                + Add question
              </button>
            )}
          </div>

          {questions.length === 0 ? (
            <div className="surface p-10 text-center">
              <p className="font-display text-lg text-ink/60">No questions yet</p>
              <p className="mt-1 text-sm text-ink/40">Add one manually, or generate a full set with AI.</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionEditor
                key={q._id || i}
                question={q}
                index={i}
                onChange={(updated) => updateQuestion(i, updated)}
                onDelete={() => removeQuestion(i)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuiz;