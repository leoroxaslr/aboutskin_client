import React from "react";
import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import http from "../../lib/http";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
const cartfromlocal = JSON.parse(localStorage.getItem("cart") || "[]");

const Checkout = () => {
  const navigate = useNavigate();
  const imageLink = import.meta.env.VITE_API;
  const [cartItems, setCartItems] = useState(cartfromlocal);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(false);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const [paymentOption, setPaymentOption] = useState("");

  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  async function getCartItems() {
    checkToken();
    window.addEventListener("authenticated", checkToken);
    const response = await api.get("/cart");
    setCartItems(response.data?.data);
    const calculatedTotalPrice = calculateTotalPrice(response.data?.data);
    setTotalPrice(calculatedTotalPrice);
  }
  async function placeOrder() {
    const api = http({
      Authorization: `Bearer ${token}`,
    });

    try {
      const body = {
        payment_type: paymentOption,
      };
      api.post("/order", body);
      getCartItems();
      navigate("/profile/orders");
    } catch (e) {
      console.log(e);
    }
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
    getCartItems();

    return () => {
      window.removeEventListener("authenticated", () => {});
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setNumberOfItemsInCart(calculateNumberOfItemsInCart(cartItems));
  }, [cartItems]);

  function checkToken() {
    setToken(localStorage.getItem("token"));
  }

  const removeitem = (productId) => {
    const api = http({
      Authorization: `Bearer ${token}`,
    });
    const updatedCartItems = cartItems.map((product) => {
      if (product.id === productId) {
        const updatedQuantity = Math.max(product.quantity - 1, 0);
        return { ...product, quantity: updatedQuantity };
      }
      return product;
    });

    setCartItems(updatedCartItems);
    api.put(`/cart/decrement-quantity/${productId}`);
    getCartItems();
  };

  const handleRadioChange = (e) => {
    setPaymentOption(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto w-8/12 my-10">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/store">Store</Link>
            </li>
            <li>Checkout</li>
          </ul>
        </div>
        <div className="card lg:card-side bg-base-100 my-10 w-10/12">
          <h1 className="flex-none font-bold text-3xl">Shopping Cart</h1>
          <div className="container flex mx-auto max-w-2xl">
            <div className="mt-8 w-full py-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.image}
                          alt={product.image}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href={product.href}>{product.name}</a>
                            </h3>
                            <p className="ml-4">{product.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.color}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            Qty {product.quantity}
                          </p>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeitem(product.id)}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <label htmlFor="type2" className="flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-indigo-500"
              name="type"
              id="type1"
              value={"Debit/Credit Card"}
              checked={paymentOption === "Debit/Credit Card"}
              onChange={(e) => setPaymentOption(e.currentTarget.value)}
            />
            <p className="px-2 font-light "> Debit/Credit Card</p>
          </label>

          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="px-2 collapse-title text-xl font-medium">
              <label
                htmlFor="type1"
                className="flex items-center cursor-pointer"
              >
                <img
                  src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                  alt="Type 1"
                  className="h-8 ml-3"
                />
              </label>
            </div>
            <div className="collapse-content">
              <div className="mb-3">
                <label className="font-bold text-sm mb-2 ml-1">
                  Name on card
                </label>
                <div>
                  <input
                    className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Juan Dela Cruz"
                    type="text"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="font-bold text-sm mb-2 ml-1">
                  Card number
                </label>
                <div>
                  <input
                    className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                </div>
              </div>
              <div className="mb-3 -mx-2 flex items-end">
                <div className="px-2 w-1/2">
                  <label className="font-bold text-sm mb-2 ml-1">
                    Expiration date
                  </label>
                  <div>
                    <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                      <option value="01">01 - January</option>
                      {/* Add more options for months */}
                    </select>
                  </div>
                </div>
                <div className="px-2 w-1/2">
                  <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                    <option value="2020">2020</option>
                    {/* Add more options for years */}
                  </select>
                </div>
              </div>
              <div className="mb-10">
                <label className="font-bold text-sm mb-2 ml-1">
                  Security code
                </label>
                <div>
                  <input
                    className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="000"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-2 mb-2">
            <label htmlFor="type2" className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-500"
                name="type"
                id="type2"
                value={"Cash on Delivery"}
                checked={paymentOption === "Cash on Delivery"}
                onChange={(e) => setPaymentOption(e.currentTarget.value)}
              />
              <p className="px-2 font-light "> Cash on Delivery</p>
            </label>
          </div>

          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{totalPrice}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            {numberOfItemsInCart > 0 ? (
              <button
                onClick={placeOrder}
                className={`btn btn-wide mx-auto flex items-center justify-center rounded-md border border-transparent btn-neutral px-6 py-3 text-base font-light text-white shadow-sm hover:btn-primary ${
                  !paymentOption ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!paymentOption}
              >
                Pay now
              </button>
            ) : (
              <button
                className="btn btn-wide mx-auto flex items-center justify-center rounded-md border border-transparent btn-neutral text-base font-light text-white shadow-sm hover:btn-primary"
                disabled="disabled"
              >
                Pay now
              </button>
            )}
          </div>
          <div className="mt-6 flex justify-center text-center  text-sm text-gray-500">
            <p>
              <span className="pr-1">or</span>
              <Link to="/store">
                <button
                  type="button"
                  className="font-medium text-neutral hover:text-primary"
                >
                  <p>
                    Continue Shopping <span aria-hidden="true"> &rarr;</span>
                  </p>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
