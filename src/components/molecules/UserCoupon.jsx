import React, { useEffect, useState, useContext, useCallback } from "react"; // Import useCallback
import { Copy, TicketPercent, ShieldCheck, AlertTriangle, Trash2 } from "lucide-react"; // Import Trash2
import Button from "../atoms/Button";
import { api } from "../../lib/api";
import { ValueContext } from "../../context/ValueContext"; // Import ValueContext
import { toast } from "sonner"; // Import toast

export default function UserCoupon({ refreshKey }) {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin } = useContext(ValueContext); // Get isAdmin from context

  // Define loadCoupons using useCallback
  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/discounts");
      const items = Array.isArray(data?.items) ? data.items : [];

      // Filter out duplicate codes, prioritizing user-specific over global
      const uniqueCoupons = [];
      const seenCodes = new Set();

      // First, add all user-specific coupons
      items.forEach(coupon => {
        if (!coupon.isGlobal) { // This is a user-specific coupon
          if (!seenCodes.has(coupon.code)) {
            uniqueCoupons.push(coupon);
            seenCodes.add(coupon.code);
          }
        }
      });

      // Then, add global coupons only if a coupon with that code hasn't been added yet
      items.forEach(coupon => {
        if (coupon.isGlobal) {
          if (!seenCodes.has(coupon.code)) {
            uniqueCoupons.push(coupon);
            seenCodes.add(coupon.code);
          }
        }
      });

      setCoupons(uniqueCoupons);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array because it doesn't depend on any external state that changes

  useEffect(() => {
    loadCoupons();
  }, [refreshKey, loadCoupons]); // Add loadCoupons to useEffect dependencies

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code); // จำว่ารหัสไหนถูก copy ล่าสุด
  };

  const handleDelete = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`/discounts/${couponId}`);
        toast.success("Coupon deleted successfully!"); // Success toast
        loadCoupons(); // Refresh coupons after deletion
      } catch (e) {
        console.error("Failed to delete coupon:", e);
        const msg = e?.response?.data?.message || e?.message || "Failed to delete coupon. You may not have permission or the coupon does not exist.";
        toast.error(msg); // Error toast
      }
    }
  };

  return (
    <div id="coupons" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-2 pb-4">
        <TicketPercent className="w-5 h-5 text-[#B29674]" />
        <h2 className="text-xl font-bold text-gray-800">My Coupons</h2>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        coupons.length === 0 ? (
          <p className="text-sm text-gray-500">คุณยังไม่มีคูปอง</p>
        ) : (
          <div className="space-y-4">
            {coupons.map((c) => {
              const start = c.startDate ? new Date(c.startDate) : null;
              const end = c.endDate ? new Date(c.endDate) : null;
              const range = start && end ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}` : "";
              const badge = c.isValid ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> valid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3 h-3" /> {c.invalidReason || "invalid"}
                </span>
              );
              return (
                <div key={c._id || c.code} className="rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-[#B29674]">{c.code}</p>
                    {c.description ? <p className="text-sm text-gray-700">{c.description}</p> : null}
                    <p className="text-sm text-gray-700">
                      Discount: {c.type === "percentage" ? `${c.value}%` : `฿${c.value.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{range}</p>
                    <div className="mt-1">{badge}</div>
                  </div>
                  <div className="flex flex-col gap-2"> {/* Use flex-col for buttons */}
                    <Button onClick={() => handleCopy(c.code)} className="flex items-center gap-1">
                      <Copy size={16} /> {copiedCode === c.code ? "Copied!" : "Copy"}
                    </Button>
                    {isAdmin && ( // Conditionally render delete button for admins
                      <Button
                        onClick={() => handleDelete(c._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 size={16} /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}