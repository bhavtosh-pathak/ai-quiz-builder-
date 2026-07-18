const StatCard = ({ label, value, suffix = '', eyebrow, accent = 'primary' }) => {
  const accentClasses = {
    primary: 'text-primary-500',
    gold: 'text-gold-500',
    success: 'text-success',
    danger: 'text-danger',
  };

  return (
    <div className="surface p-5">
      {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentClasses[accent]}`}>
        {value}
        {suffix && <span className="text-lg text-ink/40 font-body">{suffix}</span>}
      </p>
    </div>
  );
};

export default StatCard;
