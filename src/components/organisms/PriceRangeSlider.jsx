import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PriceRangeSlider = ({ initialRange, onApply }) => {
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleApply = () => {
    onApply(range);
  };

  return (
    <div className="w-[220px]">
      <div className="text-sm text-[#B29675] mb-3">
        {`฿${range[0].toLocaleString()} - ฿${range[1].toLocaleString()}`}
      </div>

      <Slider
        range
        min={0}
        max={20000}
        step={100}
        value={range}
        onChange={setRange}
      />

      <button
        onClick={handleApply}
        className="mt-4 w-full px-4 py-2 border text-sm rounded text-[#B29675] border-[#B29675] hover:bg-[#B2967520] transition"
      >
        Apply
      </button>
    </div>
  );
};

export default PriceRangeSlider;