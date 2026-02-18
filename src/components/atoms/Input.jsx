export default function Input({ className = "", left, right, ...props }) {
  return (
    <div className={`relative ${className}`}>
      {left && <span className="absolute inset-y-0 left-3 flex items-center">{left}</span>}
      <input
        className={`w-full rounded-xl border border-[#B29674] bg-white/70 px-4 py-2.5 outline-none 
                     focus:ring-2 focus:ring-[#B29674]/50
                    ${left ? "pl-10" : ""} ${right ? "pr-10" : ""}`}
        {...props}
      />
      {right && <span className="absolute inset-y-0 right-3 flex items-center">{right}</span>}
    </div>
  );
}

