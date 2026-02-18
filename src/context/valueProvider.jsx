import { ValueContext } from './ValueContext';
import { useMemo, useState, useEffect } from "react";
import { Toaster, toast } from 'sonner';
import { api } from '../lib/api';

export const ValueProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  // Auth state (very lightweight demo auth)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAuth = !!user;

   const [isAdmin, setIsAdmin] = useState(false);

  const login = (payload) => {
    const u = payload || { name: "User", email: "user@example.com", role: "user"};
    setUser(u);
    try {
      localStorage.setItem("user", JSON.stringify(u));
      //setIsAdmin(u.role === "admin")
     } catch { }
      
    
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("user"); } catch {}
    // reset cart and related state for a fresh user session
    setCart([]);
    setCheckoutItem([]);
    setInstallChecked(false);
    try { localStorage.removeItem("cart"); } catch {}
  };

  // Initialize cart (persisted)
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const [checkoutItem, setCheckoutItem] = useState([]);
  const [installChecked, setInstallChecked] = useState(false);


  async function addToCart(productId, variantId, quantity, color) {
    if (!productId) {
      return toast.warning("Product not found.")
    }
      try {

      const res = await api.post(
        "/cart/items",
        {
          productId: productId,
          variantId: variantId,
          quantity: quantity,
        }
        );

      setCart((prev) => {
      const index = prev.findIndex((cartItem) => cartItem.variantId === variantId);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: (next[index].quantity || 0) + quantity };
       
        return next;
      }
      
      return [
        ...prev,
        {
          productId: productId,
          variantId: variantId,
          image: null,
          name: null,
          variantName: null,
          color: null,
          price: null,
          quantity: quantity,
          checked: false,
        },
      ];
    });
        
      toast.success('Added to cart', {duration: 1000})

      //console.log("Added to cart success:", res.data);
    } catch (error) {
      //console.error("Add to cart error:", error);
      toast.error("Please Login");
    }
  } // <-- Add this closing brace to properly end addToCart

  const removeFromCart = (skuId) => {
    setCart((prev) => prev.filter((x) => x.skuId !== skuId));
  };

const removeChecked = async (cart) => {
  try {
    // 1. Get an array of all items to be deleted
    const itemsToDelete = cart
      .filter((item) => item.checked)
      .map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
      }));

    if (itemsToDelete.length === 0) {
      toast.warning("No items selected for deletion.");
      return;
    }
    
    // 2. Send a single request with the array of items
    await api.post("/cart/items/delete-multiple", { items: itemsToDelete });

    // 3. If the request is successful, update the UI
    setCart((prevCart) => prevCart.filter((item) => !item.checked));

  } catch (error) {
    console.error("Failed to remove items:", error);
    alert("Failed to remove items. Please try again.");
  }
  };
  
  const cartCount = useMemo(
    () => cart.reduce((sum, it) => sum + (it.quantity || 0), 0),
    [cart]
  );

  return (
    <ValueContext.Provider
      value={{
        // auth
        user,
        isAuth,
        login,
        logout,
        setUser,
        cart,
        setCart,
        checkoutItem,
        setCheckoutItem,
        installChecked,
        setInstallChecked,
        addToCart,
        removeFromCart,
        removeChecked,
        cartCount,
        isModalOpen,
        setIsModalOpen,
        product, setProduct,
        isAdmin, setIsAdmin
      }}
    >
      {children}
    </ValueContext.Provider>
  );
};
