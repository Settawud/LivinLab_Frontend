const TagBadge = ({ label }) => {
  return (
    <div className="inline-block px-3 py-1 text-sm font-medium rounded-[8px] text-charcoal bg-sage-green">
      {label}
    </div>
  );
};

export default TagBadge;