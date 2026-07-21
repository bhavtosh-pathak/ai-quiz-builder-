import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import QuestionEditor from '../../components/QuestionEditor';
import { aiService } from '../../services/aiService';

const PROMPT_IDEAS = [
  'Generate  Java OOP MCQs',
  'Generate  DBMS questions on normalization',
  'Generate a Data Structures quiz on trees and graphs',
  'Generate  questions on React hooks',
];

const AIQuizGenerator = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('mixed');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Describe the quiz you want, e.g. "Generate 10 Java OOP MCQs"');
    setGenerating(true);
    setQuestions(null);
    try {
      const res = await aiService.generateQuiz({ topic, count, difficulty });
      setQuestions(res.questions);
      toast.success(`Generated ${res.count} questions`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const updateQuestion = (index, updated) => setQuestions((qs) => qs.map((q, i) => (i === index ? updated : q)));
  const removeQuestion = (index) => setQuestions((qs) => qs.filter((_, i) => i !== index));

  const continueToBuilder = () => {
    navigate('/teacher/quizzes/new', { state: { aiQuestions: questions } });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="section-eyebrow">✨ AI Quiz Generator</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Prompt your way to a full quiz</h1>
        <p className="mt-1 text-sm text-ink/50">Powered by Google Gemini. Review and edit before publishing.</p>
      </div>

      <div className="surface p-5 mb-6">
        <label className="label">What should the quiz cover?</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder='e.g. "Generate 10 Java OOP MCQs"'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {PROMPT_IDEAS.map((p) => (
            <button
              key={p}
              onClick={() => setTopic(p)}
              className="rounded-full border border-ink/12 px-3 py-1 text-xs text-ink/55 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Number of questions</label>
            <input
              type="number"
              min={1}
              max={25}
              className="input"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="mixed">Mixed</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={generating} className="btn-gold mt-5 w-full sm:w-auto">
          {generating ? 'Generating with Gemini...' : '✨ Generate questions'}
        </button>
      </div>

      {generating && (
        <div className="surface p-10 text-center animate-fade-up">
          <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
          <p className="text-sm text-ink/50 font-mono">Gemini is drafting your questions...</p>
        </div>
      )}

      {questions && !generating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-eyebrow">Review & edit ({questions.length})</p>
            {/* <button onClick={continueToBuilder} className="btn-primary text-sm">
              Continue to quiz builder →
            </button> */}
          </div>
          {questions.map((q, i) => (
            <QuestionEditor
              key={i}
              question={q}
              index={i}
              onChange={(updated) => updateQuestion(i, updated)}
              onDelete={() => removeQuestion(i)}
            />
          ))}
          <button onClick={continueToBuilder} className="btn-primary w-full">
            Continue to quiz builder →
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AIQuizGenerator;
