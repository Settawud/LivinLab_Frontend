import { useState } from "react";

const FilterOrder = ({ onFilterChange }) => {
  const [form, setForm] = useState({
    orderNumber: "",
    keyword: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newForm = { ...form, [id]: value };
    setForm(newForm);
  };

  const handleSearch = () => {
    onFilterChange(form);
  };

  return (
    <div className="rounded text-sm text-[#A8A8A8]">
      <div className="flex flex-col lg:flex-row justify-end items-stretch lg:items-end gap-4 pt-4">
        <div className="flex flex-col lg:w-64">
          <label htmlFor="orderNumber" className="mb-1">Order Number</label>
          <input
            type="text"
            id="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            placeholder="Enter order number"
            className="w-full rounded border border-[#B29675] p-3 text-black placeholder-[#A8A8A8] hover:bg-[#B2967510] focus:outline-none focus:ring-1 focus:ring-[#B29675]"
          />
        </div>

        <div className="flex flex-col lg:w-64">
          <label htmlFor="keyword" className="mb-1">Keyword</label>
          <input
            type="text"
            id="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="Search by product name"
            className="w-full rounded border border-[#B29675] p-3 text-black placeholder-[#A8A8A8] hover:bg-[#B2967510] focus:outline-none focus:ring-1 focus:ring-[#B29675]"
          />
        </div>

        <div className="flex flex-col lg:w-64">
          <label htmlFor="dateFrom" className="mb-1">From</label>
          <input
            type="date"
            id="dateFrom"
            value={form.dateFrom}
            onChange={handleChange}
            className="w-full rounded border border-[#B29675] p-3 text-black hover:bg-[#B2967510] focus:outline-none focus:ring-1 focus:ring-[#B29675]"
          />
        </div>

        <div className="flex flex-col lg:w-64">
          <label htmlFor="dateTo" className="mb-1">To</label>
          <input
            type="date"
            id="dateTo"
            value={form.dateTo}
            onChange={handleChange}
            className="w-full rounded border border-[#B29675] p-3 text-black hover:bg-[#B2967510] focus:outline-none focus:ring-1 focus:ring-[#B29675]"
          />
        </div>

        <div className="w-full lg:w-auto">
          <button
            onClick={handleSearch}
            className="w-full lg:w-auto rounded bg-[#B29675] px-6 py-3 text-white hover:bg-[#9e8460] transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOrder;