export default function Button({
  className = "",
  children,
  variant = "primary", // primary | secondary | ghost | onDark
  onClick,
  size = "md", // sm | md | lg
  fullWidth = false,
  type = "button",
  ...props
}) {
  const base = [
    "inline-flex items-center justify-center",
    "rounded-xl font-medium select-none",
    "transition-colors transition-transform duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-900/20",
    "cursor-pointer",
  ].join(" ");

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-6 text-lg",
  };

  const variants = {
    primary:
      "bg-sandy-beige text-white shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-white text-sandy-beige border border-sandy-beige hover:bg-sandy-beige/10",
    ghost: "bg-transparent text-inherit hover:bg-stone-900/5",
    onDark: "bg-white/10 text-white border border-white/60 hover:bg-white/20",
  };

  return (
    <button
      {...props}
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
