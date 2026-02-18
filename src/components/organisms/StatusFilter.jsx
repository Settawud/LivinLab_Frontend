const StatusFilter = ({ currentStatus, onStatusChange }) => {
  const statuses = [
    "All",
    "Pending",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="text-sm font-medium text-[#A8A8A8]">
      <nav className="flex justify-between py-4">
        {statuses.map((status) => (
          <div
            key={status}
            className={`flex-grow cursor-pointer rounded-t p-6 text-center hover:bg-[#B2967510] ${
              currentStatus === status
                ? "border-b-2 border-[#B29675] text-[#B29675]"
                : ""
            }`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default StatusFilter;
