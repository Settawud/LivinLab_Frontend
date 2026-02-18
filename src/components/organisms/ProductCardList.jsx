import { Link } from "react-router-dom";
import { ValueContext } from "../../context/ValueContext";
import { useContext } from "react";

const ProductCardList = ({ _id, imageSrc, title, tag, size, price, trial = false }) => {

  const { isModalOpen, setIsModalOpen, setProduct } = useContext(ValueContext)

    const clickAddToCart = (id) => {
    setIsModalOpen(true)
    //console.log(id)
    setProduct(id)
  }

  return (
    <div className="relative w-full max-w-sm overflow-hidden bg-white border border-[#b29675] rounded-xl shadow transition-transform duration-300 ease-in-out hover:scale-105">
      {trial && (
        <>
          <div aria-hidden className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
          <span className="absolute top-2 left-2 z-10 rounded-full bg-amber-600/95 text-white text-[10px] font-semibold px-2 py-0.5">Trial</span>
        </>
      )}
      <Link to={`/products/${_id}`}>
        <img
          src={imageSrc}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/logoCutBackground2.png";
          }}
        />
      </Link>
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {tag.map((t, index) => (
            <div
              key={index}
              className="inline-block px-2 py-0.5 text-sm font-medium bg-[#849E9150] text-[#849E91] rounded"
            >
              {t}
            </div>
          ))}
        </div>
        <h3 className="text-xl text-black truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A8A8A8] truncate overflow-hidden whitespace-nowrap">
            {size}
          </span>
          <span className="text-2xl font-semibold text-black">฿{price}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 text-white">
          <div className="flex items-center justify-center w-full h-12 bg-[#B29675] rounded-lg hover:bg-[#B2967590] transition" onClick={() => clickAddToCart(_id)}>
            <button className="text-lg">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
