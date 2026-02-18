export default function Section({
  id,
  title,
  subtitle,
  actions,
  className = "",
  children,
}) {
  return (
    <section id={id} className={`py-14 md:py-16 ${className}`}>
      {/* ตัวคุมความกว้าง + จัดกลางทั้งบล็อก */}
      <div className="max-w-6xl mx-auto px-6">
        {(title || subtitle || actions) && (
          // จัดกึ่งกลางหัวข้อ/ซับไตเติลตรงนี้
          <header className="mb-10 text-center">
            {title && (
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-2 text-stone-600">{subtitle}</p>
            )}
            {actions && <div className="mt-4">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
