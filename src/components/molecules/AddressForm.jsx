import React, { useState, useEffect, useRef } from "react";
import Button from "../atoms/Button";
import { api } from "../../lib/api";

export default function AddressForm({ onSave, editData, editId }) {
  const [form, setForm] = useState({
    buildingNo: "",
    detail: "",
    provinceId: "",
    districtId: "",
    subdistrictId: "",
    postcode: "",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me/address/provinces");
        setProvinces(Array.isArray(data?.items) ? data.items : []);
      } catch {}
    })();
  }, []);

  // Prefill when editing
  useEffect(() => {
    (async () => {
      if (!editData) {
        setForm({ buildingNo: "", detail: "", provinceId: "", districtId: "", subdistrictId: "", postcode: "", isDefault: false });
        setDistricts([]);
        setSubdistricts([]);
        return;
      }
      const provinceId = editData?.province?._id || editData?.province || "";
      const districtId = editData?.district?._id || editData?.district || "";
      const subdistrictId = editData?.subdistrict?._id || editData?.subdistrict || "";
      setForm({
        buildingNo: editData.buildingNo || "",
        detail: editData.detail || "",
        provinceId,
        districtId,
        subdistrictId,
        postcode: editData.postcode || editData?.subdistrict?.postcode || "",
        isDefault: !!editData.isDefault,
      });
      try {
        if (provinceId) {
          const d = await api.get(`/users/me/address/province/${provinceId}/districts`);
          setDistricts(Array.isArray(d?.data?.items) ? d.data.items : []);
        }
        if (districtId) {
          const s = await api.get(`/users/me/address/district/${districtId}/subdistricts`);
          setSubdistricts(Array.isArray(s?.data?.items) ? s.data.items : []);
        }
      } catch {}
    })();
  }, [editData]);

  const handleChange = async (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "provinceId") {
      setForm((prev) => ({ ...prev, districtId: "", subdistrictId: "", postcode: "" }));
      try {
        const { data } = await api.get(`/users/me/address/province/${value}/districts`);
        setDistricts(Array.isArray(data?.items) ? data.items : []);
        setSubdistricts([]);
      } catch {}
    }
    if (key === "districtId") {
      setForm((prev) => ({ ...prev, subdistrictId: "", postcode: "" }));
      try {
        const { data } = await api.get(`/users/me/address/district/${value}/subdistricts`);
        setSubdistricts(Array.isArray(data?.items) ? data.items : []);
      } catch {}
    }
    if (key === "subdistrictId") {
      try {
        const { data } = await api.get(`/users/me/address/subdistrict/${value}`);
        const code = data?.item?.postcode || "";
        setForm((prev) => ({ ...prev, postcode: code }));
      } catch {}
    }
  };

  const handleSubmit = async () => {
    if (!form.buildingNo || !form.provinceId || !form.districtId || !form.subdistrictId || !/^\d{5}$/.test(String(form.postcode))) {
      alert("Please complete required fields (including valid 5-digit postal code).");
      return;
    }
    onSave(form, editId || null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        {editData ? "Edit Address" : "Add Address"}
      </h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Building No."
          value={form.buildingNo}
          onChange={(e) => setForm((p) => ({ ...p, buildingNo: e.target.value }))}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#B29674]"
        />

        {/* Detail */}
        <input
          type="text"
          placeholder="Detail"
          value={form.detail}
          onChange={(e) => setForm((p) => ({ ...p, detail: e.target.value }))}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#B29674]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SelectSearch
            items={provinces}
            valueId={form.provinceId}
            onChange={(id) => handleChange("provinceId", id)}
            placeholder="Province"
            getId={(p) => p._id || p.province_id}
            getLabel={(p) => p.name_th || p.name_en}
          />
          <SelectSearch
            items={districts}
            valueId={form.districtId}
            onChange={(id) => handleChange("districtId", id)}
            placeholder="District"
            disabled={!form.provinceId}
            getId={(d) => d._id || d.district_id}
            getLabel={(d) => d.name_th || d.name_en}
          />
          <SelectSearch
            items={subdistricts}
            valueId={form.subdistrictId}
            onChange={(id) => handleChange("subdistrictId", id)}
            placeholder="Subdistrict"
            disabled={!form.districtId}
            getId={(s) => s._id || s.subdistrict_id}
            getLabel={(s) => s.name_th || s.name_en}
          />
        </div>

        <input
          type="text"
          placeholder="Postal Code"
          value={form.postcode}
          onChange={(e) => setForm((p) => ({ ...p, postcode: e.target.value }))}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#B29674]"
        />

        {/* Default address */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            id="isDefault"
            checked={form.isDefault}
            onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
            className="mr-2 accent-[#B29674]"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} className="px-4">
          {editData ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}

// Lightweight searchable select with scrollable dropdown
function SelectSearch({
  items = [],
  valueId = "",
  onChange,
  placeholder = "Select...",
  disabled = false,
  getId = (x) => x?.id ?? x?._id ?? x?.value,
  getLabel = (x) => x?.label ?? x?.name_th ?? x?.name_en ?? String(getId(x) ?? ""),
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const sel = items.find((it) => String(getId(it)) === String(valueId));
    setInputValue(sel ? getLabel(sel) : "");
  }, [valueId, items]);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  const filtered = query
    ? items.filter((it) => getLabel(it).toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div ref={ref} className={`relative ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center">
        <input
          type="text"
          value={open ? query : inputValue}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#B29674] ${
            (!inputValue && !query) ? "text-stone-500" : "text-gray-800"
          }`}
        />
        <button type="button" onClick={() => setOpen((v) => !v)} className="-ml-8 px-2 py-2 text-stone-500">▾</button>
      </div>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border bg-white shadow max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-stone-500">No results</div>
          ) : (
            filtered.map((it) => {
              const id = getId(it);
              const label = getLabel(it);
              const active = String(id) === String(valueId);
              return (
                <button
                  key={String(id)}
                  type="button"
                  onClick={() => { onChange?.(String(id)); setOpen(false); setQuery(""); setInputValue(label); }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-stone-100 ${active ? "bg-stone-50 font-medium" : ""}`}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
