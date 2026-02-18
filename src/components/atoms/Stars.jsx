export default function Stars({ value = 0, outOf = 5, className = "" }) {
  return (
    <div className={`flex gap-0.5 text-amber-500 ${className}`}>
      {Array.from({ length: outOf }).map((_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
