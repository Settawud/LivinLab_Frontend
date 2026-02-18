import React from "react";
import AddressCard from "./AddressCard";

export default function AddressList({ addresses, selectedAddress, onSelect, onEdit, onDelete }) {
  return (
    <div className="space-y-3">
      {addresses.map((addr, index) => (
        <AddressCard
          key={index}
          address={addr}
          isSelected={selectedAddress === index}
          onClick={() => onSelect(index)}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}
