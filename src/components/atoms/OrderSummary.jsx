import ProductItem from "./ProductItem";

export default function OrderSummary({
  products,
  subtotal,
  assemblyFee,
  shippingFee,
  discount,
  total,
}) {
  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Order Summary
      </h2>

      {/* Product list header */}
      <div className="mb-6">
        <div className="grid grid-cols-[100px_1fr_auto] gap-6 items-center font-semibold text-gray-600 border-b-2 border-gray-300 pb-2">
          <div>สินค้า</div>
          <div>ชื่อสินค้า</div>
          <div className="text-right">ราคา</div>
        </div>

        {/* Product items */}
        {products.map((product, idx) => (
          <ProductItem key={idx} {...product} />
        ))}
      </div>

      {/* Price breakdown */}
      <div className="grid grid-cols-[1fr_auto] gap-4 text-gray-700 mb-6 border-t-2 border-gray-300 pt-4">
        <span>Subtotal</span>
        <span className="font-medium text-right">฿{subtotal}</span>
        <span>Assembly Service Fee</span>
        <span className="font-medium text-right">฿{assemblyFee}</span>
        <span>Shipping Fee</span>
        <span className="font-medium text-right">฿{shippingFee}</span>
        <span>ส่วนลด</span>
        <span className="font-medium text-right">฿{discount}</span>
      </div>

      {/* Grand total */}
      <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
        <span className="text-xl font-bold text-gray-800">Total Amount</span>
        <span className="text-2xl font-extrabold text-black">฿{total}</span>
      </div>
    </div>
  );
}
