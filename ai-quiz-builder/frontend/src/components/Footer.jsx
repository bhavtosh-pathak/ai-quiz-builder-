const Footer = () => (
  <footer className="border-t border-ink/10 bg-paper">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-ink text-xs font-semibold text-gold-400 font-display">
            Q
          </span>
          <span className="text-sm text-ink/50">AI Quiz Builder — built for classrooms that move fast.</span>
        </div>
        <p className="font-mono text-xs text-ink/35">© {new Date().getFullYear()} AI Quiz Builder</p>
      </div>
    </div>
  </footer>
);

export default Footer;
