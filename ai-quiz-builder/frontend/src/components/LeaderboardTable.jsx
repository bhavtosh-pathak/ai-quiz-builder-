const rankStyles = (rank) => {
  if (rank === 1) return 'bg-gold-50 text-gold-600 border-gold-200';
  if (rank === 2) return 'bg-ink/5 text-ink/70 border-ink/15';
  if (rank === 3) return 'bg-danger-light text-danger border-danger/20';
  return 'bg-transparent text-ink/50 border-transparent';
};

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/**
 * Scoreboard-styled leaderboard. Rows use tabular mono digits so scores
 * line up like a real scoreboard, and freshly-updated rows get a brief
 * gold flash via the `rank-pulse` keyframe (see index.css).
 */
const LeaderboardTable = ({ leaderboard = [], highlightStudentId, isLive }) => {
  if (leaderboard.length === 0) {
    return (
      <div className="surface p-10 text-center">
        <p className="font-display text-lg text-ink/60">No submissions yet</p>
        <p className="mt-1 text-sm text-ink/40">The board fills in the moment the first student submits.</p>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/10 bg-paper-dim px-5 py-3">
        <p className="section-eyebrow">Leaderboard</p>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 w-16">Rank</th>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3 text-right">Score</th>
              <th className="px-5 py-3 text-right">Percentage</th>
              <th className="px-5 py-3 text-right hidden sm:table-cell">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row) => (
              <tr
                key={row.studentId}
                className={`border-b border-ink/5 last:border-0 ${
                  row.studentId === highlightStudentId ? 'bg-primary-50' : ''
                } animate-rank-pulse`}
              >
                <td className="px-5 py-3.5">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-xs font-bold ${rankStyles(
                      row.rank
                    )}`}
                  >
                    {row.rank}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-xs font-semibold text-white shrink-0"
                      style={{ backgroundColor: row.avatarColor || '#3B4CCA' }}
                    >
                      {row.studentName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium truncate">{row.studentName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono font-semibold tabular-nums">
                  {row.score}
                  <span className="text-ink/35">/{row.totalMarks}</span>
                </td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums">{row.percentage}%</td>
                <td className="px-5 py-3.5 text-right font-mono text-xs text-ink/45 hidden sm:table-cell">
                  {formatTime(row.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
