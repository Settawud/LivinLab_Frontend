import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import { api } from "../lib/api";

export default function OrderconfirmPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันช่วยเหลือ
  const safeNumber = (value) => Number(value) || 0;

  const formatDateTimeTH = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ดึงข้อมูล Order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        console.log("Order data:", res.data?.item); // ตรวจสอบ field จริง
        setOrder(res.data?.item || null);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        alert("ไม่พบคำสั่งซื้อนี้ หรือคุณไม่ได้เข้าสู่ระบบ");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  // คำนวณราคา
  const subtotal = safeNumber(order?.subtotalAmount);
  const discount = safeNumber(order?.discountAmount);
  const installationFee = safeNumber(order?.installationFee);
  const totalAmount = subtotal - discount + installationFee;

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-4 md:p-8">
        {/* Confirmation Message */}
        <section className="bg-yellow-50 text-yellow-800 p-4 rounded-md mx-auto mt-6 max-w-4xl shadow-sm text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-700">
            ✅ Order Successful!
          </h1>
          <p className="text-yellow-700 font-bold mt-2">
            Thank you! Your order has been placed successfully.
          </p>
          <p className="text-lg font-semibold text-yellow-800 mt-1">
            Order Number: {order?.orderNumber || "-"}
          </p>
        </section>

        {/* Main Content */}
        <main className="container mx-auto p-4 mt-8 flex flex-col md:flex-row gap-8 items-start flex-1">
          {/* Order Summary */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Order Summary
            </h2>

            {/* Products */}
            <div className="mb-6">
              <div className="grid grid-cols-[100px_1fr_auto] gap-6 items-center font-semibold text-gray-600 border-b-2 border-gray-300 pb-2">
                <div>Product</div>
                <div>Product Name</div>
                <div className="text-right">Price</div>
              </div>

              {order?.items?.length > 0 ? (
                order.items.map((item, idx) => {
                  const price = safeNumber(item?.variant?.price);
                  const qty = safeNumber(item?.variant?.quantity);
                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-[100px_1fr_auto] gap-6 items-center my-3"
                    >
                      {/* Image */}
                      <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
                        <img
                          src={item?.variant?.image || "/placeholder.png"}
                          alt={item?.productName || "no-name"}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <p className="font-medium text-gray-800">
                          {item?.productName || "-"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item?.variant?.trial && (
                            <span className="text-amber-600 font-medium mr-2">
                              Trial Product (7 Days)
                            </span>
                          )}
                          Color: {item?.variant?.variantOption || "-"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity {qty} Items
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right font-semibold text-gray-700">
                        ฿{(price * qty).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No items in your order
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  ฿{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-medium text-red-600">
                  -฿{discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Assembly Service Fee</span>
                <span className="font-medium">
                  ฿{installationFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium">฿0</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
              <span className="text-xl font-bold text-gray-800">
                Total Amount
              </span>
              <span className="text-2xl font-extrabold text-black">
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Shipping Address
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold text-lg mb-1">Recipient Name</p>
                <p className="text-gray-800">{order?.name || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Address</p>
                <p className="text-gray-800">
                  {order?.shipping?.address || "ไม่พบที่อยู่"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Phone Number</p>
                <p className="text-gray-800">{order?.phone || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Order created time</p>
                <p className="text-gray-800">
                  {formatDateTimeTH(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}