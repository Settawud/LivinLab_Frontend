const OrderHistory = ({ orders }) => {
  return (
    <section className="mx-auto px-4 py-3">
      <div className="mb-3 text-3xl font-semibold">Order History</div>
      <div className="overflow-hidden rounded-lg border border-[#B29675] text-sm">
        <table className="w-full table-auto">
          <thead className="bg-[#B29675] text-sm uppercase tracking-wider text-white">
            <tr>
              <th className="px-6 py-3 text-left">Order Information</th>
              <th className="px-6 py-3 text-left">Shipping Information</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="space-y-1 px-6 py-4 align-top">
                  <p>
                    <span className="font-medium text-[#00000090]">
                      Order Date:
                    </span>{" "}
                    {order.orderDate}
                  </p>
                  <p>
                    <span className="font-medium text-[#00000090]">
                      Number of Items:
                    </span>{" "}
                    {order.numberOfItems}
                  </p>
                </td>
                <td className="space-y-1 px-6 py-4 align-top">
                  <p>
                    <span className="font-medium text-[#00000090]">
                      Shipping Date:
                    </span>{" "}
                    {order.shipping.shippingDate}
                  </p>
                  <p>
                    <span className="font-medium text-[#00000090]">
                      Tracking Number:
                    </span>{" "}
                    {order.shipping.shippingMethod}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderHistory;
