export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h3 className="text-xl font-semibold text-stone-800">{title}</h3>
        {subtitle && <p className="text-stone-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
