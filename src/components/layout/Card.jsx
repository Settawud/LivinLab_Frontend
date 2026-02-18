export default function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-white/70 p-2 shadow-sm
                  ${hover ? "transition hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
