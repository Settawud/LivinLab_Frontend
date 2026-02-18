import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

import OrderSummarySection from "../components/organisms/OrderSummarySection";
import ProductDetails from "../components/organisms/ProductDetails";
import ShippingAddress from "../components/organisms/ShippingAddress";
import OrderHistory from "../components/organisms/OrderHistory";
import Sidebar from "../components/organisms/Sidebar";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";

const Order_History_Detail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        const mapped = mapOrderData(res.data.item);
        setOrder(mapped);
      } catch (err) {
        console.error("Failed to fetch order detail", err);
      }
    };

    fetchOrder();
  }, [id]);



  if (!order) return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-xl">Loading order...</span>
    </div>);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8 mx-auto">
        <Sidebar />
        <main className="flex-1">
          <OrderSummarySection
            orderNumber={order.orderNumber}
            orderStatus={order.orderStatus}
            shippingStatus={order.shippingStatus}
          />
          <ShippingAddress
            name={order.shippingAddress.name}
            phone={order.shippingAddress.phone}
            address={order.shippingAddress.address}
          />
          <ProductDetails
            products={order.products}
            discountAmount={order.discountAmount}
            installationFee={order.installationFee}
          />
          <OrderHistory orders={order.orderHistory} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Order_History_Detail;

function mapOrderData(data) {
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    orderNumber: data.orderNumber,
    orderStatus: data.orderStatus,
    shippingStatus: data.shipping?.deliveryStatus,
    discountAmount: data.discountAmount,
    installationFee: data.installationFee,

    products: items.map((item) => ({
      id: item.productId?.$oid || item.productId,
      name: item.productName,
      quantity: item.variant.quantity,
      unitPrice: item.variant.price,
    })),

    shippingAddress: {
      name: data.name,
      phone: data.phone,
      address: data.shipping?.address,
    },

    orderHistory: [
      {
        orderDate: formatDate(data.createdAt?.$date || data.createdAt),
        numberOfItems: items.length,
        shipping: {
          shippingDate: data.shipping?.shippedAt
            ? formatDate(data.shipping.shippedAt)
            : "",
          shippingMethod: data.shipping.trackingNumber,
        },
      },
    ],
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}