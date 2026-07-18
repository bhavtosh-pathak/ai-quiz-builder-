import { useEffect } from 'react';

/**
 * Minimal, accessible confirm dialog. Closes on Escape or backdrop click.
 * Used for the "submit quiz" confirmation, and reusable anywhere else
 * a lightweight yes/no prompt is needed instead of window.confirm().
 */
const Modal = ({ open, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, confirmVariant = 'primary' }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass = confirmVariant === 'gold' ? 'btn-gold' : confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm px-4 animate-fade-up"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="surface w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <div className="mt-2 text-sm text-ink/60">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary text-sm" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`${confirmClass} text-sm`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;