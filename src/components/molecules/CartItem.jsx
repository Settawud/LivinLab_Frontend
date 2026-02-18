import React, { useState, useContext } from 'react'
import QuantityButton2 from '../atoms/QuantityButton2'
import QuantityButton from '../atoms/QuantityButton'
import CheckboxWithText from '../atoms/CheckboxWithText';
import { ValueContext } from '../../context/ValueContext';


const CartItem = ({ item }) => {

    
    const {cart,setCart,setCheckoutItem} = useContext(ValueContext)
    
    const subtotal = item.quantity * item.price;
    //const {subtotal, setSubtotal} = useState(item.price * item.quantity)

    const [isChecked, setIsChecked] = useState(false)

    const handleSelect = (skuId) => {
        setIsChecked(!isChecked)
        const updatedCart = cart.map((item) => (item.variantId === skuId ? { ...item, checked: !item.checked } : item));
    setCart(updatedCart)
    setCheckoutItem(updatedCart.filter(item => item.checked));
    }


  return (
    <tr key={item.variantId}>
                      <td className="p-4 text-center">
              <CheckboxWithText name="select" skuId={item.variantId} checked={item.checked} onChange={() => handleSelect(item.variantId)} />
                      </td>
                      <td><img src={item.image}
                          className="sm:mx-auto max-w-14 max-h-14 p-1 border-1 rounded-sm border-gray-300 shadow-[0_2px_4px_1px_rgba(209,213,219,0.2)]"
                          alt={item.name} /></td>
                      <td className="p-4 text-sm break-words">
                          <div className="grid grid-cols-2 grid-rows-[1fr_auto] sm:block">
                              <div className="col-span-2 mx-2">{item.name} <br /> <span className='font-semibold'>{item.trial ? "Trial Product" : ""}</span> Color: {item.color} </div>
                              <div
                                  className="mt-2 mx-2 font-semibold row-start-2 sm:text-center sm:hidden self-end">
                      ฿{subtotal}</div>
                  <div className="justify-self-end mt-2 mx-2 ">
                      <QuantityButton item={item} className="sm:hidden text-sm"/>
                  </div>
                  
                          </div>
                      </td>
          <td className="hidden sm:table-cell sm:p-4">
              <div className="flex justify-center items-center">
                  <QuantityButton item={item} className="text-sm"/></div>

                      </td>
                      
          <td className="p-4 sm:text-center text-sm hidden sm:table-cell">฿{subtotal}</td>
                  </tr>
  )
}

export default CartItem


    // <tr key={item.variantId}>
    //                   <td className="p-4 text-center">
    //           <CheckboxWithText name="select" skuId={item.variantId} checked={item.checked} onChange={() => handleSelect(item.variantId)} />
    //                   </td>
    //                   <td><img src={item.image}
    //                       className="sm:mx-auto max-w-14 max-h-14 p-1 border-1 rounded-sm border-gray-300 shadow-[0_2px_4px_1px_rgba(209,213,219,0.2)]"
    //                       alt={item.name} /></td>
    //                   <td className="p-4 text-sm break-words">
    //                       <div className="grid grid-cols-2 grid-rows-[1fr_auto] sm:block">
    //                           <div className="col-span-2 mx-2">{item.name} <br /> <span className='font-semibold'>{item.trial ? "Trial Product" : ""}</span> Color: {item.color} </div>
    //                           <div
    //                               className="mt-2 mx-2 font-semibold row-start-2 sm:text-center sm:hidden self-end">
    //                   ฿{subtotal}</div>
    //               <div className="justify-self-end mt-2 mx-2 ">
    //                   <QuantityButton item={item} className="sm:hidden text-sm"/>
    //               </div>
                  
    //                       </div>
    //                   </td>
    //       <td className="hidden sm:table-cell sm:p-4">
    //           <div className="flex justify-center items-center">
    //               <QuantityButton item={item} className="text-sm"/></div>

    //                   </td>
                      
    //       <td className="p-4 sm:text-center text-sm hidden sm:table-cell">฿{subtotal}</td>
    //               </tr>
