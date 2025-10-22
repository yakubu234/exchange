import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const savedForLater = localStorage.getItem("savedItems");
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedForLater) {
      setSavedItems(JSON.parse(savedForLater));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      
      if (existingItem) {
        toast({
          title: "Updated Cart",
          description: `${item.name} quantity increased`,
        });
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart`,
      });
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const saveForLater = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      setSavedItems((prev) => [...prev, item]);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      toast({
        title: "Saved for Later",
        description: `${item.name} has been saved for later`,
      });
    }
  };

  const moveToCart = (id) => {
    const item = savedItems.find((i) => i.id === id);
    if (item) {
      setCartItems((prev) => [...prev, item]);
      setSavedItems((prev) => prev.filter((i) => i.id !== id));
      toast({
        title: "Moved to Cart",
        description: `${item.name} has been moved to your cart`,
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
