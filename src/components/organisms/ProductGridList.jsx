import ProductCardList from "./ProductCardList";

const ProductGridList = ({ products, page, setPage, totalPages }) => {

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {products.map((product, index) => (
          <ProductCardList key={index} {...product} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 rounded hover:bg-[#B2967590] disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 rounded hover:bg-[#B2967590] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductGridList;
