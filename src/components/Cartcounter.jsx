import React, { useEffect, useState } from "react";
import http from "../lib/http";

function CartCounter() {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(false);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  async function getCartItems() {
    checkToken();
    window.addEventListener("authenticated", checkToken);
    const response = await api.get("/cart");
    setCartItems(response.data?.data);
    const calculatedTotalPrice = calculateTotalPrice(response.data?.data);
    setTotalPrice(calculatedTotalPrice);
  }

  function calculateNumberOfItemsInCart(cartItems) {
    return cartItems.length;
  }
  function calculateTotalPrice(cartItems) {
    let total = 0;
    for (const item of cartItems) {
      total += item.price;
    }
    return total;
  }

  useEffect(() => {
    checkToken();
    window.addEventListener("authenticated", checkToken);

    const debounceTimer = setTimeout(() => {
      getCartItems();
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("authenticated", () => {});
    };
  }, [cartItems]);

  useEffect(() => {
    setNumberOfItemsInCart(calculateNumberOfItemsInCart(cartItems));
  }, [cartItems]);

  function checkToken() {
    setToken(localStorage.getItem("token"));
  }
  return (
    <div>
      {numberOfItemsInCart}
      {totalPrice}
    </div>
  );
}

export default CartCounter;
