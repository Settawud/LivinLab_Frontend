import { useContext, useState, useEffect } from "react";
import { ValueContext } from "../../context/ValueContext";
import { ClipboardType } from "lucide-react";
import { api } from "../../lib/api";
import { useRef } from "react";

function normalizePublicImage(p) {
  if (!p) return null;
  const s = String(p);
  if (/^https?:\/\//i.test(s)) return s;
  let cleaned = s.replace(/^\.\/+/, "");
  if (cleaned.startsWith("/images/")) return cleaned;
  if (cleaned.startsWith("images/")) return "/" + cleaned;
  const idx = cleaned.indexOf("images/");
  if (idx >= 0) return "/" + cleaned.slice(idx);
  return `/images/${cleaned}`;
}

const AddToCartModal = ({ product }) => {
  const {
      _id,
      imageSrc,
      title,
      tag,
      size,
    price,
    material,
    thumbnails,
      variants
  } = product;
  

  const [selected, setSelected] = useState("buy");
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const {addToCart} = useContext(ValueContext)
  
  const trial = variants.some(variant => variant.trial)

  const [colorMap, setColorMap] = useState({});
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${_id}`);
          const data = res.data.item;
  
          const colorResponses = await Promise.all(
            data.variants.map((v) =>
              api
                .get(`/colors/${v.colorId}`)
                .then((res) => ({ id: v.colorId, hex: res.data.item.hex }))
                .catch(() => ({ id: v.colorId, hex: "#D3D3D3" }))
            )
          );
  
          const map = colorResponses.reduce((acc, color) => {
            acc[color.id] = color.hex;
            return acc;
          }, {});

          setColorMap(map)

        } catch (err) {
          console.error("Error fetching product:", err);
          setProductData(null);
        } 
      };

      fetchProduct();
    }, []);

    useEffect(() => {
      const filtered = variants.filter((v) =>
        selected === "trial" ? v.trial === true : v.trial !== true
      );
      if (filtered.length > 0 && !selectedColor) {
        setSelectedColor(filtered[0]._id);
      }
    }, [selected, variants, selectedColor]);
   
  
    const filteredVariants = variants.filter((v) =>
      selected === "trial"
        ? v.trial === true
        : v.trial !== true
    );
  
    const currentVariant = selectedColor
      ? filteredVariants.find((v) => v._id === selectedColor)
      : filteredVariants[0] || {};
  
    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  
    const quantityInStock = currentVariant.quantityInStock || 0;
    
  
    const currentPrice = currentVariant.price || 0
    
    return (
      <div className="flex flex-col gap-3 text-black">
        <div className="text-3xl font-semibold leading-snug">{title}</div>

  
        <img 
          src={currentVariant.image?.url || thumbnails?.[0]?.url || imageSrc} 
          alt={title} 
          className="h-50 w-50 p-1 border-1 mx-auto rounded-sm border-gray-300 shadow-[0_2px_4px_1px_rgba(209,213,219,0.2)]"
        />
        <div className="pt-2">
          <ul className="list-disc list-inside text-sm text-charcoal">
            {currentVariant.dimensions &&
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
            {size && <li>Size: {size}</li>}
          </ul>
        </div>
        <div>
          <div className="pb-1 text-sm font-medium">Color</div>
          <div className="flex gap-2">
            {filteredVariants.map((v) => (
              <div
                key={v._id}
                onClick={() => setSelectedColor(v._id)}
                className={`w-6 h-6 border rounded-full cursor-pointer hover:border-black hover:border-2 ${
                  selectedColor === v._id ||
                  (!selectedColor && v === filteredVariants[0])
                    ? "border-black border-2"
                    : ""
                }`}
                style={{ backgroundColor: colorMap[v.colorId] }}
              />
            ))}
          </div>
        </div>
  
        <hr className="my-3 border-[#B29675]" />
  
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {trial && (
              <button
                onClick={() => {
                  setSelected("trial");
                  setSelectedColor(null);
                }}
                className={`flex-1 h-12 bg-off-white px-4 py-2 font-semibold rounded text-sm transition ${
                  selected === "trial"
                    ? "bg-[#849E91] text-white hover:bg-[#849E9190] border-none"
                    : "border border-[#B29675] text-[#B29675] hover:bg-[#B2967590]"
                }`}
              >
                ทดลองใช้ ฿
                {variants.find((v) => v.trial === true && v.colorId === currentVariant.colorId)?.price}
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
            >
              ซื้อเดี๋ยวนี้ ฿
              {variants.find((v) => v.trial !== true && v.colorId === currentVariant.colorId)?.price}
            </button>
          </div>
        </div>
  
        <div className="flex flex-col sm:flex-row gap-2 w-full bg-off-white">
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
            >
              +
            </button>
          </div>
          <button
            onClick={() => addToCart(_id, currentVariant._id, quantity,selectedColor)}
            disabled={quantityInStock === 0}
            className={`h-12 px-4 py-2 rounded text-sm w-full lg:w-1/2 transition ${
              quantityInStock === 0
                ? "bg-[#B2967590] text-white cursor-not-allowed"
                : "bg-[#B29675] text-white hover:bg-[#B2967590]"
            }`}
          >
            {quantityInStock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
  
      </div>
    );
  

};

export default AddToCartModal;
