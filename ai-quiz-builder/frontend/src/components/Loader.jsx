const Loader = ({ fullScreen = false, label = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-ink/10" />
        <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-ink/50 font-mono">{label}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-paper">{spinner}</div>;
  }
  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export default Loader;
