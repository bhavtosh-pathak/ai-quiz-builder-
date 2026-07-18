import toast from 'react-hot-toast';

/**
 * Displays a quiz's join code as a scantron/ticket-stub chip — the page's
 * signature element — with one-click copy for sharing.
 */
const QuizCodeTicket = ({ code, size = 'md' }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Quiz code copied');
    } catch {
      toast.error('Could not copy — copy it manually');
    }
  };

  return (
    <button
      onClick={copy}
      title="Click to copy"
      className={`quiz-code-ticket hover:opacity-90 transition-opacity ${
        size === 'lg' ? 'text-2xl px-6 py-4' : ''
      }`}
    >
      {code}
      <span className="text-paper/40 text-xs font-body normal-case tracking-normal">copy</span>
    </button>
  );
};

export default QuizCodeTicket;
