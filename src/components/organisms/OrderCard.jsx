import { useNavigate } from "react-router-dom";
import ReviewSection from "./ReviewSection";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const reviewedProducts = new Set();

  const handleClick = () => {
    navigate(`/orderhistory/${order._id}`);
  };

  console.log(order)

  return (
    <div
      onClick={handleClick}
      className="mb-5 cursor-pointer rounded-lg border border-[#B29675] bg-white p-6 hover:bg-[#B2967510]"
    >
      <div className="flex items-center justify-between pb-4 text-sm">
        <p className="font-medium text-[#849E91]">
          Order Number: {order.orderId}
          <span> ({order.date})</span>
        </p>
        <p className="font-medium text-[#849E91]">{order.status}</p>
      </div>

      {order.items.map((item, idx) => {
        const alreadyRendered = reviewedProducts.has(item.productId);
        if (!alreadyRendered) reviewedProducts.add(item.productId);

        return (
          <div key={idx}>
            <div className="flex items-start gap-4 pt-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-48 rounded-md border object-cover"
              />
              <div className="flex-1 space-y-2">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[#A8A8A8]">Color: {item.color}</p>
                <p className="text-sm text-[#A8A8A8]">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">฿{item.price}</p>
            </div>

            {!alreadyRendered && (
              <div onClick={(e) => e.stopPropagation()}>
                <ReviewSection productId={item.productId} orderStatus={order.status} />
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-4 text-right">
        <p className="text-sm text-gray-500">Subtotal: ฿{order.subtotalAmount}</p>
        <p className="text-sm text-gray-500">Installation: +฿{order.installationFee}</p>
        <p className="text-sm text-gray-500">Discount: −฿{order.discountAmount}</p>
        <p className="text-lg font-semibold">
          Total: ฿{order.total}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
