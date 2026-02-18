import React, { useState, useContext } from "react";
import ContactForm from "../components/molecules/ContactForm";
import OrderSummary from "../components/molecules/OrderSummary";
import UserAddress from "../components/organisms/UserAddress";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import { ValueContext } from "../context/ValueContext";
import { api } from "../lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [coupon, setCoupon] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { cart, installChecked } = useContext(ValueContext);
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleConfirmOrder = async () => {
    if (!contact.name || !contact.phone) {
      toast.error("Please enter your contact details");
      return;
    }
    if (!/^0\d{9}$/.test(contact.phone)) {
      toast.error("Phone number must be 10 digits and start with 0.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        name: contact.name,
        phone: contact.phone,
        discountCode: coupon || "",
        installationFee: installChecked ? 200 : 0,
        shipping: {
          address: selectedAddress.fullAddress || selectedAddress.address || "",
        },
      };

      const { data } = await api.post("/orders", payload);

      toast.success("Order placed successfully!");
      navigate(`/order-confirm/${data.item._id}`);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Order failed";
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f1]">
      <Navbar />
      <main className="flex-1">
        <h1 className="p-4 text-center">Shipping details and order summary</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 ">
          <div className="space-y-4">
            <ContactForm value={contact} onChange={setContact} />
            <UserAddress onSelectAddress={handleAddressSelect} />
          </div>
          <OrderSummary
            cart={cart}
            coupon={coupon}
            setCoupon={setCoupon}
            onConfirmOrder={handleConfirmOrder}
            installationFee={installChecked ? 200 : 0}
            isPlacingOrder={isPlacingOrder}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}