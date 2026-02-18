import React, { useState, useContext, useEffect } from 'react';
import { ValueContext } from "../../context/ValueContext";
import { api } from '../../lib/api';

const QuantityButton = ({ min = 1, max = 99, onChange, className="" ,item = ""}) => {
  const [quantity, setQuantity] = useState(item?.quantity ?? min);
  const {setCart} = useContext(ValueContext)

  // sync internal state when item.quantity changes
  useEffect(() => {
    if (typeof item?.quantity === 'number') {
      setQuantity(item.quantity);
    }
  }, [item?.quantity]);

  const handleDecrease = async () => {
          
    try {

      if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange && onChange(newQuantity);
      await api.patch(`/cart/items/${item.productId}/${item.variantId}`, {quantity: newQuantity})
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.variantId === item.variantId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
        );
        
      } else {
        console.error("Quantity less than 1 or not a number")
    }
      
    } catch (error) {
      console.error("error: ", error)
      
    }

  };

  const handleIncrease = async () => {

    try {
          if (quantity < max && !isNaN(quantity)) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
            onChange && onChange(newQuantity);
            
        await api.patch(`/cart/items/${item.productId}/${item.variantId}`, { quantity: newQuantity })
            
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.variantId === item.variantId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
      
          } else {
            console.error("exceed quantity max or quantity is not a number")
      }
      
    } catch (error) {
      console.error("error: ", error)
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

export default QuantityButton;
