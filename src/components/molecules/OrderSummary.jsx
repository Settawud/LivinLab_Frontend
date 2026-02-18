import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import CouponInput from "./CouponInput";
import { api } from "../../lib/api";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function OrderSummary({ cart, coupon, setCoupon, onConfirmOrder, installationFee, isPlacingOrder }) {
  const [discounts, setDiscounts] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const shippingFee = 0;

  const subtotal = cart
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const total = subtotal + installationFee + shippingFee - discountAmount;

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const res = await api.get("/discounts");
        setDiscounts(res.data?.items || []);
      } catch (err) {
        toast.error("Failed to load discount codes");
      }
    }

    fetchDiscounts();
  }, []);

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;

    const now = dayjs();
    const matched = discounts.find((d) => {
      const codeMatch = d.code.toLowerCase() === coupon.trim().toLowerCase();
      const notExpired = dayjs(d.startDate).isBefore(now) && dayjs(d.endDate).isAfter(now);
      const usageOk = d.usedCount < d.usageLimit;
      return codeMatch && notExpired && usageOk;
    });

    if (!matched) {
      toast.error("Invalid or expired discount code");
      setDiscountAmount(0);
      setSelectedDiscount(null);
      return;
    }

    let discount = 0;

    if (matched.type === "percentage" || matched.type === "PERCENT") {
      discount = Math.floor((subtotal * matched.value) / 100);
    } else if (matched.type === "amount" || matched.type === "AMOUNT") {
      discount = matched.value;
    }

    setDiscountAmount(discount);
    setSelectedDiscount(matched);
    toast.success(`Discount applied: ${matched.code}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-gray-700 font-semibold">
            <th className="pb-2 text-left w-[80px]">Product</th>
            <th className="pb-2 text-left">Name</th>
            <th className="pb-2 text-right w-[100px]">Price</th>
          </tr>
        </thead>
        <tbody>
          {cart
            .filter((item) => item.checked)
            .map((item, index) => (
              <tr key={index}>
                <td className="py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 rounded-lg"
                  />
                </td>
                <td className="py-2 align-top">
                  {item.name}
                  <div className="text-gray-500 text-xs">
                    {item.trial && (
                      <span className="text-amber-600 font-medium mr-2">
                        Trial Product (7 days)
                      </span>
                    )}
                    Color: {item.color} <br />
                    Quantity: {item.quantity} item
                  </div>
                </td>
                <td className="py-2 text-right align-top">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>฿{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Assembly Service Fee</span>
          <span>฿{installationFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>฿{shippingFee.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-700 font-medium">
            <span>Discount ({selectedDiscount?.code})</span>
            <span>-฿{discountAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <CouponInput
        value={coupon}
        onChange={setCoupon}
        onApply={handleApplyCoupon}
      />

      <div className="mt-4 flex justify-between font-bold text-lg text-gray-800">
        <span>Total Amount:</span>
        <span className="text-gray-800">฿{total.toLocaleString()}</span>
      </div>

      <Button
        className="mt-4 w-full"
        onClick={onConfirmOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? "Placing Order..." : "Confirm Order"}
      </Button>
    </div>
  );
}