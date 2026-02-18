import React, { useState, useContext } from 'react';
import { ValueContext } from "../../context/ValueContext";

const QuantityButton2 = ({ min = 1, max = 99, onChange, className="" ,item = ""}) => {
  const [quantity, setQuantity] = useState(min);
  const {setCart} = useContext(ValueContext)

        const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      //onChange && onChange(newQuantity);
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.skuId === item.skuId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      //onChange && onChange(newQuantity);
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.skuId === item.skuId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
      
    }
  };

  return (
    <div className={"flex items-center justify-around text-off-white p-1 bg-sandy-beige rounded-md " + `${className}`}>
      <button onClick={handleDecrease} className="px-2">−</button>
      <span>{item ? item.quantity : quantity}</span>
      <button onClick={handleIncrease} className="px-2">+</button>
    </div>
  );
};

export default QuantityButton2;