import OrderNumberWithCopy from "./OrderNumberWithCopy";
import OrderStatusCard from "./OrderStatusCard";

const OrderSummarySection = ({ orderNumber, orderStatus, shippingStatus }) => {
  return (
    <>
      <OrderNumberWithCopy orderNumber={orderNumber} />
      <section className="mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrderStatusCard type="shipped" statusText={orderStatus} />
        <OrderStatusCard type="inTransit" statusText={shippingStatus} />
      </section>
    </>
  );
};

export default OrderSummarySection;
