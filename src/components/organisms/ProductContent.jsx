import { useContext, useEffect, useState } from "react";
import { ValueContext } from "../../context/ValueContext";

const ProductContent = ({ product = {}, onVariantChange }) => {
  const {
    _id,
    Name,
    Description = "",
    tag = [],
    material,
    variants: rawVariants = [],
  } = product;

  const [selected, setSelected] = useState("buy");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const { addToCart } = useContext(ValueContext);

  const variants = Array.isArray(rawVariants) ? rawVariants : [];

  const trialAvailable = variants.some((variant) => variant.trial === true);

  const filteredVariants = variants.filter((v) =>
    selected === "trial" ? v.trial === true : v.trial !== true
  );

  useEffect(() => {
    const hasSelectedInFiltered = selectedColor
      ? filteredVariants.some((v) => v._id === selectedColor)
      : false;

    if (!hasSelectedInFiltered && filteredVariants.length > 0) {
      setSelectedColor(filteredVariants[0]._id);
    }
  }, [filteredVariants]);

  const safeFindVariantById = (id) =>
    variants.find((v) => v._id === id) ||
    filteredVariants.find((v) => v._id === id);

  const currentVariant =
    (selectedColor && safeFindVariantById(selectedColor)) ||
    filteredVariants[0] ||
    {};

  const priceNum = Number(currentVariant?.price) || 0;
  const formattedPrice = priceNum ? priceNum.toLocaleString() : "-";

  const quantityInStock = Number(currentVariant?.quantityInStock) || 0;

  const getDisplayPriceForType = (isTrial) => {
    if (selectedColor) {
      const v = variants.find(
        (x) => x._id === selectedColor && (Boolean(x.trial) === Boolean(isTrial))
      );
      if (v && v.price != null) return Number(v.price);
    }

    if (currentVariant?.color) {
      const v = variants.find(
        (x) => x.color === currentVariant.color && (Boolean(x.trial) === Boolean(isTrial))
      );
      if (v && v.price != null) return Number(v.price);
    }

    const v = variants.find((x) => Boolean(x.trial) === Boolean(isTrial));
    if (v && v.price != null) return Number(v.price);

    return 0;
  };

  const trialPriceNum = getDisplayPriceForType(true);
  const buyPriceNum = getDisplayPriceForType(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-3 text-black">
      <div className="text-3xl font-semibold leading-snug">{Name}</div>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(tag) && tag.length > 0
          ? tag.map((t, index) => (
              <div
                key={`${t}-${index}`}
                className="inline-block px-2 py-0.5 text-sm font-medium bg-[#849E9150] text-[#849E91] rounded"
              >
                {t}
              </div>
            ))
          : null}
      </div>

      <div className="text-3xl font-bold">฿{formattedPrice}</div>

      <hr className="my-3 border-[#B29675]" />

      <div className="space-y-3 text-sm">
        {Array.isArray(Description) ? (
          Description.map((text, index) => <p key={index}>{text}</p>)
        ) : (
          <p>{Description}</p>
        )}
      </div>

      <hr className="my-3 border-[#B29675]" />

      <div>
        <div className="pb-1 text-sm font-medium">Color</div>
        <div className="flex gap-2">
          {filteredVariants.length === 0 && (
            <div className="text-sm text-gray-500">No colors available</div>
          )}
          {filteredVariants.map((v) => {
            const bg = v.color || "#D3D3D3";
            const isSelected = selectedColor === v._id;
            return (
              <button
                key={v._id}
                onClick={() => {
                  setSelectedColor(v._id);
                  onVariantChange?.(v._id);
                }}
                aria-pressed={isSelected}
                title={v.color || "color"}
                className={`w-6 h-6 border rounded-full cursor-pointer focus:outline-none ${
                  isSelected ? "border-black border-2" : "border-gray-300"
                }`}
                style={{ backgroundColor: bg }}
                type="button"
              />
            );
          })}
        </div>
      </div>

      <hr className="my-3 border-[#B29675]" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {trialAvailable && (
            <button
              onClick={() => {
                setSelected("trial");
                setSelectedColor(null);
              }}
              className={`flex-1 h-12 px-4 py-2 font-semibold rounded text-sm transition ${
                selected === "trial"
                  ? "bg-[#849E91] text-white hover:bg-[#849E9190] border-none"
                  : "border border-[#B29675] text-[#B29675] hover:bg-[#B2967590]"
              }`}
              type="button"
            >
              ทดลองใช้ ฿{trialPriceNum ? trialPriceNum.toLocaleString() : "-"}
            </button>
          )}
          <button
            onClick={() => {
              setSelected("buy");
              setSelectedColor(null);
            }}
            className={`flex-1 h-12 px-4 py-2 font-semibold rounded text-sm transition ${
              selected === "buy"
                ? "bg-[#849E91] text-white hover:bg-[#849E9190] border-none"
                : "border border-[#B29675] text-[#B29675] hover:bg-[#B2967590]"
            }`}
            type="button"
          >
            ซื้อเดี๋ยวนี้ ฿{buyPriceNum ? buyPriceNum.toLocaleString() : "-"}
          </button>
        </div>
      </div>

      <hr className="my-3 border-[#B29675]" />

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div
          className={`flex items-center justify-between h-12 px-4 py-2 border rounded transition w-full lg:w-1/2 ${
            quantityInStock === 0
              ? "border-[#B2967590] text-gray-400 cursor-not-allowed bg-[#B2967510]"
              : "border-[#B29675] hover:bg-[#B2967510] text-black"
          }`}
        >
          <button
            onClick={decrement}
            disabled={quantityInStock === 0}
            className={`px-2 text-lg rounded transition ${
              quantityInStock === 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-[#B2967590]"
            }`}
            type="button"
          >
            −
          </button>
          <span className="px-4 rounded">{quantity}</span>
          <button
            onClick={increment}
            disabled={quantityInStock === 0}
            className={`px-2 text-lg rounded transition ${
              quantityInStock === 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-[#B2967590]"
            }`}
            type="button"
          >
            +
          </button>
        </div>
        <button
          onClick={() =>
            addToCart(
              _id,
              currentVariant?._id || null,
              quantity,
              currentVariant?.color || null
            )
          }
          disabled={quantityInStock === 0 || !currentVariant?._id}
          className={`h-12 px-4 py-2 rounded text-sm w-full lg:w-1/2 transition ${
            quantityInStock === 0 || !currentVariant?._id
              ? "bg-[#B2967590] text-white cursor-not-allowed"
              : "bg-[#B29675] text-white hover:bg-[#B2967590]"
          }`}
          type="button"
        >
          {quantityInStock === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>

      <div className="pt-4">
        <div className="pb-2 font-semibold">Product Information</div>
        <ul className="list-disc list-inside text-sm text-[#A8A8A8]">
          {currentVariant?.dimensions &&
            typeof currentVariant.dimensions === "object" &&
            Object.entries(currentVariant.dimensions)
              .filter(([k]) => k !== "unit")
              .map(([key, value]) => {
                const unit = currentVariant.dimensions.unit?.[key] || "";
                return (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value} {unit}
                  </li>
                );
              })}
          {material && <li>Material: {material}</li>}
        </ul>
      </div>
    </div>
  );
};

export default ProductContent;
