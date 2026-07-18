const SearchFilterBar = ({ search, onSearchChange, status, onStatusChange, statusOptions }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className="relative flex-1">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30">🔍</span>
      <input
        className="input !pl-9"
        placeholder="Search by title, subject, or description..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    {statusOptions && (
      <select className="input sm:w-48" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default SearchFilterBar;
