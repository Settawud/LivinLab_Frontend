import React, { useEffect, useState } from "react";
import { CirclePlus, Loader2 } from "lucide-react";
import AddressList from "../molecules/AddressList";
import AddressForm from "../molecules/AddressForm";
import Modal from "../layout/Modal";
import Button from "../atoms/Button";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function UserAddress({ onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/me/addresses");
      const items = Array.isArray(data?.items) ? data.items : [];
      setAddresses(items);
      const idx = items.findIndex((a) => a.isDefault);
      setSelectedIndex(idx >= 0 ? idx : items.length ? 0 : null);

      if (onSelectAddress && idx >= 0) {
        onSelectAddress({
          ...items[idx],
          fullAddress: formatAddress(items[idx]),
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load addresses";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSave = async (formData, addressId = null) => {
    try {
      setLoading(true);
      if (addressId) {
        await api.patch(`/users/me/addresses/${addressId}`, {
          buildingNo: formData.buildingNo,
          detail: formData.detail,
          postcode: formData.postcode,
          province: formData.provinceId,
          district: formData.districtId,
          subdistrict: formData.subdistrictId,
          isDefault: !!formData.isDefault,
        });
        toast.success("Address updated");
      } else {
        await api.post(`/users/me/addresses`, {
          buildingNo: formData.buildingNo,
          detail: formData.detail,
          postcode: formData.postcode,
          province: formData.provinceId,
          district: formData.districtId,
          subdistrict: formData.subdistrictId,
          isDefault: !!formData.isDefault,
        });
        toast.success("Address added");
      }
      setShowPopup(false);
      setEditId(null);
      await loadAddresses();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Save failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      const addr = addresses[index];
      if (!addr) return;
      setLoading(true);
      await api.delete(`/users/me/addresses/${addr.addressId}`);
      toast.success("Address deleted");
      await loadAddresses();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Delete failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const addr = addresses[index];
    setEditId(addr?.addressId || null);
    setShowPopup(true);
  };

  const formatAddress = (addr) => {
    const province = addr.provinceName || addr?.province?.name_th || addr?.province?.name_en || "";
    const district = addr.districtName || addr?.district?.name_th || addr?.district?.name_en || "";
    const subdistrict = addr.subdistrictName || addr?.subdistrict?.name_th || addr?.subdistrict?.name_en || "";
    const building = addr.buildingNo || addr.building || "";
    const full = `${building} ${addr.detail || ""} ${subdistrict} ${district} ${province} ${addr.postcode || ""}`.replace(/\s+/g, " ").trim();
    return addr.isDefault ? ` ${full}` : full;
  };

  const handleSelect = async (i) => {
    try {
      setSelectedIndex(i);
      const addr = addresses[i];
      if (!addr) return;
      setLoading(true);
      await api.patch(`/users/me/addresses/${addr.addressId}`, { isDefault: true });
      await loadAddresses();

      if (onSelectAddress) {
        onSelectAddress({
          ...addr,
          fullAddress: formatAddress(addr),
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to set default";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="address">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 border-gray-200 pb-4">
          Shipping Address
        </h2>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-stone-600">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading addresses...
            </div>
          ) : (
            <AddressList
              addresses={addresses.map((a) => formatAddress(a))}
              selectedAddress={selectedIndex}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <div className="mt-2">
          <button
            onClick={() => {
              setShowPopup(true);
              setEditId(null);
            }}
            className="flex items-center justify-center gap-1 px-4 py-3 text-charcoal hover:underline"
          >
            <CirclePlus />
            <span className="font-medium">Add new address</span>
          </button>
        </div>
      </div>

      {showPopup && (
        <Modal onClose={() => setShowPopup(false)}>
          <AddressForm
            onSave={handleSave}
            editData={editId ? addresses.find((a) => String(a.addressId) === String(editId)) : null}
            editId={editId}
          />
        </Modal>
      )}
    </div>
  );
}
