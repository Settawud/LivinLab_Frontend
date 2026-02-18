import { useState, useRef, useEffect } from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { ChevronDown, X as XIcon } from "lucide-react";

const Dropdown = ({
  label,
  options,
  selected,
  setSelected,
  useFixedLabel = false,
  useLabelPrefix = false,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onSelect = (opt) => {
    if (useLabelPrefix && opt === selected) {
      setOpen(false);
      return;
    }

    const newValue = opt === selected && !useLabelPrefix ? null : opt;
    setSelected(newValue);
    setOpen(false);
  };

  const renderLabel = () => {
    if (useFixedLabel) return label;
    if (useLabelPrefix) return `${label}${selected ? `: ${selected}` : ""}`;
    return selected || label;
  };

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center text-center p-3 w-full bg-[#fefdf9] hover:bg-[#B2967510] transition-colors cursor-pointer group rounded h-12"
      >
        <span
          className={`text-sm transition ${
            selected ? "text-[#B29675]" : "text-[#A8A8A8]"
          } truncate`}
        >
          {renderLabel()}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`w-4 h-4 ml-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute z-30 mt-1 w-full sm:w-auto rounded-lg border border-[#ddd] bg-white shadow-md
        origin-top
        transform transition-all duration-300 ease-in-out
        ${
          open
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }
        `}
        style={{ transformOrigin: "top" }}
      >
        {children ? (
          <div className="p-4">{children}</div>
        ) : (
          <ul className="max-h-56 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => onSelect(opt)}
                className={`px-4 py-2 cursor-pointer text-sm text-[#444] select-none rounded-md
                ${
                  selected === opt
                    ? "bg-[#B2967530] text-[#B29675] font-semibold"
                    : "hover:bg-[#B2967510] hover:text-[#B29675]"
                }
                `}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const FilterProduct = ({ filters, setFilters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 w-full sm:w-fit gap-2">
      <Dropdown
        label="Category"
        options={["Chairs", "Tables", "Accessories"]}
        selected={filters.category}
        setSelected={(value) => setFilters((f) => ({ ...f, category: value }))}
        useFixedLabel={true}
      />
      <Dropdown
        label="Availability"
        options={["In Stock", "All Product"]}
        selected={filters.availability}
        setSelected={(value) =>
          setFilters((f) => ({ ...f, availability: value }))
        }
        useFixedLabel={true}
      />
      <Dropdown
        label="Price"
        useFixedLabel={true}
        selected={
          filters.price
            ? `฿${filters.price[0].toLocaleString()} - ฿${filters.price[1].toLocaleString()}`
            : null
        }
      >
        <PriceRangeSlider
          initialRange={filters.price || [0, 20000]}
          onApply={(value) => setFilters((f) => ({ ...f, price: value }))}
        />
      </Dropdown>
    </div>
  );
};

export const SortProduct = ({ sort, setSort }) => {
  return (
    <div className="flex items-center justify-center mt-2 md:mt-0 w-full sm:w-fit">
      <Dropdown
        label="Sort"
        options={["New In", "Price High to Low", "Price Low to High"]}
        selected={sort}
        setSelected={setSort}
        useLabelPrefix={true}
      />
    </div>
  );
};

export const Tags = ({ filters, removeFilter, clearAll }) => {
  const tags = Object.entries(filters)
    .filter(([_, v]) => v)
    .map(([key, value]) => ({ key, label: value }));

  const hasTags = tags.length > 0;

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-4 mb-6 max-w-full">
      <div className="flex flex-wrap gap-4">
        {hasTags ? (
          tags.map(({ key, label }) => (
            <div
              key={key}
              onClick={() => removeFilter(key)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#A8A8A810] hover:bg-[#A8A8A890] transition cursor-pointer"
            >
              <span className="text-sm text-black">
                {Array.isArray(label)
                  ? `฿${label[0].toLocaleString()} - ฿${label[1].toLocaleString()}`
                  : label}
              </span>
              <XIcon aria-hidden="true" className="w-4 h-4" />
            </div>
          ))
        ) : (
          <span className="text-sm text-[#A8A8A8]">No filters applied</span>
        )}
      </div>

      <button
        onClick={clearAll}
        disabled={!hasTags}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition cursor-pointer
          ${
            hasTags
              ? "bg-black hover:bg-[#A8A8A8] text-white"
              : "bg-[#ccc] text-white cursor-not-allowed"
          }`}
      >
        <span className="text-sm">Clear All</span>
      </button>
    </div>
  );
};

const ProductFilterSortTags = ({ filters, setFilters, sort, setSort }) => {
  const removeFilter = (key) => {
    setFilters((f) => ({ ...f, [key]: null }));
  };

  const clearAll = () => {
    setFilters({
      category: null,
      availability: null,
      price: null,
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4">
        <FilterProduct filters={filters} setFilters={setFilters} />
        <SortProduct sort={sort} setSort={setSort} />
      </div>
      <Tags filters={filters} removeFilter={removeFilter} clearAll={clearAll} />
    </div>
  );
};

export default ProductFilterSortTags;
