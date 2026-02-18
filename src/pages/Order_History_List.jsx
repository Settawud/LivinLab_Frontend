import { useEffect, useState } from "react";
import { api } from "../lib/api";

import StatusFilter from "../components/organisms/StatusFilter";
import OrderCard from "../components/organisms/OrderCard";
import FilterOrder from "../components/organisms/FilterOrder";
import Sidebar from "../components/organisms/Sidebar";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";

const Order_History_List = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");

  const [filters, setFilters] = useState({
    orderNumber: "",
    keyword: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {

    const fetchOrdersAndProducts = async () => {
      try {
        const orderRes = await api.get("/orders");

        const rawOrders = orderRes.data.items;
        const mappedOrders = rawOrders.map((order) => ({
          _id: order._id,
          orderId: order.orderNumber,
          date: new Date(order.createdAt).toISOString().split("T")[0],
          status: order.orderStatus,
          items: order.items.map((item) => {
            const variant = item.variant;
            return {
              productId: item.productId,
              image: variant.image,
              name: item.productName,
              color: variant.variantOption,
              quantity: variant.quantity,
              price: variant.price,
            };
          }),
          subtotalAmount: order.subtotalAmount || 0,
          installationFee: order.installationFee || 0,
          discountAmount: order.discountAmount || 0,
          total:
            (order.subtotalAmount || 0) +
            (order.installationFee || 0) -
            (order.discountAmount || 0),
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Error fetching orders or products:", err);
        setOrders([]);
      }
    };

    fetchOrdersAndProducts();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (status !== "All" && order.status !== status) return false;

    if (
      filters.orderNumber &&
      !order.orderId?.toLowerCase().includes(filters.orderNumber.toLowerCase())
    ) {
      return false;
    }

    if (filters.keyword) {
      const matchItem = order.items.some((item) =>
        item.name && item.name.toLowerCase().includes(filters.keyword.toLowerCase())
      );
      if (!matchItem) return false;
    }

    if (filters.dateFrom && order.date < filters.dateFrom) return false;
    if (filters.dateTo && order.date > filters.dateTo) return false;

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f1]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <FilterOrder onFilterChange={setFilters} />
            <StatusFilter currentStatus={status} onStatusChange={setStatus} />

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">No orders found</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Order_History_List;