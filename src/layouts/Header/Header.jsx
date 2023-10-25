import React from "react";
import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import http from "../../lib/http";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
const cartfromlocal = JSON.parse(localStorage.getItem("cart") || "[]");
const Header = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(cartfromlocal);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(false);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const imageLink = import.meta.env.VITE_API;

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/store?q=${searchQuery}` : "/store");
  };
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

  function handleLogout() {
    const api = http({
      Authorization: `Bearer ${token}`,
    });
    api.post("/logout");
    localStorage.clear();
    window.dispatchEvent(new Event("authenticated"));
    navigate("/");
    window.location.reload(false);
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

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        {token ? (
                          <div className="mt-8">
                            <div className="flow-root">
                              <ul
                                role="list"
                                className="-my-6 divide-y divide-gray-200"
                              >
                                {cartItems.map((product) => (
                                  <li key={product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={
                                          product.image
                                            ? `${imageLink}/public/${product.image}`
                                            : ""
                                        }
                                        alt=""
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href={product.href}>
                                              {product.name}
                                            </a>
                                          </h3>
                                          <p className="ml-4">
                                            {product.price}
                                          </p>
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
                                            onClick={() =>
                                              removeitem(product.id)
                                            }
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
                        ) : (
                          <di className="mx-auto btn flex my-96 btn-primary">
                            <Link to="/login">Login to view Cart</Link>
                          </di>
                        )}
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{totalPrice}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          {numberOfItemsInCart > 0 ? (
                            <Link to="/checkout">
                              <button
                                onClick={() => setOpen(false)}
                                className="btn btn-wide mx-auto flex items-center justify-center rounded-md border border-transparent btn-neutral px-6 py-3 text-base font-light text-white shadow-sm hover:btn-primary"
                              >
                                Checkout
                              </button>
                            </Link>
                          ) : (
                            <button
                              onClick={() => setOpen(false)}
                              className="btn btn-wide mx-auto flex items-center justify-center rounded-md border border-transparent btn-neutral text-base font-light text-white shadow-sm hover:btn-primary"
                              disabled="disabled"
                            >
                              Checkout
                            </button>
                          )}
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            <span className="pr-1">or</span>
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="navbar  w-full mx-auto text-gray-800 shadow-md ">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            AboutSkin
          </Link>
        </div>
        <div className="navbar-center">
          <form onSubmit={handleSearch} className="flex">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-auto md:w-auto lg:w-[700px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              onClick={getCartItems}
            >
              <div className="indicator z-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {numberOfItemsInCart > 0 && (
                  <span className="badge badge-sm indicator-item bg-error">
                    {numberOfItemsInCart}
                  </span>
                )}
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="font-bold text-lg mx-1">
                  {numberOfItemsInCart} Items
                </span>
                <span className="text-neutral">Subtotal: ₱{totalPrice}</span>
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => setOpen(true)}
                  >
                    Show cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                {token ? (
                  <Link to="/profile/userdash">Profile</Link>
                ) : (
                  <Link to="/login">Login to view Profile</Link>
                )}
              </li>

              <li>
                {token ? (
                  <Link to="/profile/orders">Orders</Link>
                ) : (
                  <Link to="/login">Login to view Orders</Link>
                )}
              </li>

              <li>
                {token ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
