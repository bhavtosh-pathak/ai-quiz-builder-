const difficultyBadge = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' };

/**
 * Fully editable question card: text, four options (with a radio marking
 * the correct one), difficulty, and marks. Used both for manually-built
 * quizzes and for reviewing/editing AI-generated questions before saving.
 */
const QuestionEditor = ({ question, index, onChange, onDelete }) => {
  const update = (field, value) => onChange({ ...question, [field]: value });

  const updateOption = (optIndex, value) => {
    const options = [...question.options];
    const oldValue = options[optIndex];
    options[optIndex] = value;
    // keep correctAnswer pointer in sync if we were editing the correct option's text
    const correctAnswer = question.correctAnswer === oldValue ? value : question.correctAnswer;
    onChange({ ...question, options, correctAnswer });
  };

  return (
    <div className="surface p-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/8 font-mono text-xs font-bold text-ink/60">
            {index + 1}
          </span>
          {question.source === 'ai' && (
            <span className="badge bg-primary-50 text-primary-600">✨ AI-generated</span>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-semibold text-danger hover:underline"
        >
          Remove
        </button>
      </div>

      <textarea
        className="input mb-4 resize-none"
        rows={2}
        placeholder="Question text"
        value={question.questionText}
        onChange={(e) => update('questionText', e.target.value)}
      />

      <div className="grid gap-2.5 sm:grid-cols-2 mb-4">
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors cursor-pointer ${
              question.correctAnswer === opt && opt !== ''
                ? 'border-success bg-success-light'
                : 'border-ink/12 bg-white hover:border-ink/25'
            }`}
          >
            <input
              type="radio"
              name={`correct-${question._id || index}`}
              checked={question.correctAnswer === opt && opt !== ''}
              onChange={() => onChange({ ...question, correctAnswer: opt })}
              className="accent-success"
            />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className={`${difficultyBadge[question.difficulty]} !py-1.5 border-0 outline-none cursor-pointer`}
          value={question.difficulty}
          onChange={(e) => update('difficulty', e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs text-ink/50">
          Marks
          <input
            type="number"
            min={0}
            step={0.5}
            className="input !w-16 !py-1"
            value={question.marks ?? 1}
            onChange={(e) => update('marks', Number(e.target.value))}
          />
        </label>
      </div>

      {question.explanation && (
        <p className="mt-3 text-xs text-ink/45 border-t border-ink/8 pt-3">
          <span className="font-semibold text-ink/60">Why: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

export default QuestionEditor;
