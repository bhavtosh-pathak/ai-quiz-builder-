const EmptyState = ({ icon = '📄', title, description, action }) => (
  <div className="surface flex flex-col items-center justify-center gap-2 py-16 px-6 text-center">
    <span className="text-3xl" aria-hidden>
      {icon}
    </span>
    <p className="font-display text-lg font-semibold">{title}</p>
    {description && <p className="max-w-sm text-sm text-ink/45">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
