import React, { useState } from "react";

export default function PaymentMethod() {
  const [payment, setPayment] = useState(null);

  const methods = [
    { id: "bank", label: "โอนผ่านธนาคาร" },
    { id: "card", label: "บัตรเครดิต/เดบิต" },
    { id: "cod", label: "เก็บเงินปลายทาง" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800  border-gray-200 ">
        💳 วิธีการชำระเงิน
      </h2>

      <div className="space-y-3 mt-4">
        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => setPayment(m.id)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
              ${payment === m.id
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 hover:border-amber-300"}
            `}
          >
            <span className="text-gray-700 font-medium">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
