export default function Modal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && <p className="text-sm text-davy mt-2">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>
            Keep Booking
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
