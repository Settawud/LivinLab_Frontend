export default function FormField({ label, hint, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-stone-700">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
