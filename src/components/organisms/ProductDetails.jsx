const ProductDetails = ({ products, discountAmount = 0, installationFee = 0 }) => {
  const subtotal = products.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const finalTotal = subtotal - discountAmount + installationFee;

  return (
    <section className="mx-auto px-4 py-3">
      <div className="mb-3 text-3xl font-semibold">Product Details</div>
      <div className="overflow-hidden rounded-lg border border-[#B29675] text-sm">
        <table className="w-full table-auto">
          <thead className="bg-[#B29675] text-sm uppercase tracking-wide text-white">
            <tr>
              <th className="px-6 py-3 text-left">Product Name</th>
              <th className="px-6 py-3 text-center">Quantity</th>
              <th className="px-6 py-3 text-right">Unit Price</th>
              <th className="px-6 py-3 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {products.map(({ id, name, quantity, unitPrice }) => {
              const totalPrice = quantity * unitPrice;
              return (
                <tr key={id}>
                  <td className="px-6 py-4 text-left">{name}</td>
                  <td className="px-6 py-4 text-center">{quantity}</td>
                  <td className="px-6 py-4 text-right">{unitPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">{totalPrice.toLocaleString()}</td>
                </tr>
              );
            })}

            {/* Subtotal */}
            <tr className="border-t border-[#B29675]">
              <td colSpan="3" className="px-6 py-2 text-right font-semibold">
                Subtotal
              </td>
              <td className="px-6 py-2 text-right font-semibold">{subtotal.toLocaleString()}</td>
            </tr>

            {/* Installation Fee */}
            {installationFee > 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-2 text-right font-semibold ">
                  Installation Fee
                </td>
                <td className="px-6 py-2 text-right font-semibold ">
                  +{installationFee.toLocaleString()}
                </td>
              </tr>
            )}

            {/* Discount Amount */}
            {discountAmount > 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-2 text-right font-semibold text-red-600">
                  Discount Amount
                </td>
                <td className="px-6 py-2 text-right font-semibold text-red-600">
                  -{discountAmount.toLocaleString()}
                </td>
              </tr>
            )}

            {/* Overall Total */}
            <tr className="border-t border-[#B29675] bg-[#EFEFEF]">
              <td colSpan="3" className="px-6 py-3 text-right font-semibold">
                Overall Total
              </td>
              <td className="px-6 py-3 text-right font-semibold">
                {finalTotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductDetails;
