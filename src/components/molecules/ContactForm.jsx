import React from "react";

export default function ContactForm({ value = { name: "", phone: "" }, onChange }) {
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;

    if (name === "phone") {
      // Allow only digits
      const digitsOnly = inputValue.replace(/\D/g, "");
      // And limit to 10 characters
      if (digitsOnly.length <= 10) {
        onChange({ ...value, [name]: digitsOnly });
      }
    } else {
      onChange({ ...value, [name]: inputValue });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Contact</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={value.name || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300
                     focus:outline-none focus:ring-1 focus:ring-[#B29674] bg-white"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone (10 digits)"
          value={value.phone || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300
                     focus:outline-none focus:ring-1 focus:ring-[#B29674] bg-white"
          required
          pattern="^0\d{9}$"
          title="Phone number must be 10 digits and start with 0."
        />
      </div>
    </div>
  );
}
