export default function AuthCard({ title, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-amber-200 bg-amber-50/50 p-8 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-stone-800">{title}</h1>
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
    </div>
  );
}
