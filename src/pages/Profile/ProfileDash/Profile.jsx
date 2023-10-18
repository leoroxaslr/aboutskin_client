import React from "react";
import { useState, useEffect } from "react";
import http from "../../../lib/http";
import Toast from "../../../components/Toast";
import { Link } from "react-router-dom";

const Profile = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getFilteredProducts(null);
    return () => {};
  }, []);

  async function getFilteredProducts() {
    const response = await api.request("/products");

    setProducts(response.data?.data);
  }

  const handleAddToCart = () => {
    setShowToast(true);
  };
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up event listener
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="bg-neutral min-h-screen flex">
        <div
          className={`w-1/4 bg-gray-800 text-white p-4 ${
            isSidebarOpen ? "" : "hidden"
          }`}
        >
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <ul>
            <li className="mb-2 cursor-pointer">Dashboard</li>
            <li className="mb-2 cursor-pointer">Orders</li>
            <li className="mb-2 cursor-pointer">Products</li>
            <li className="mb-2 cursor-pointer">Settings</li>
          </ul>
        </div>
        {/* Main Content */}
        <div className="w-3/4 p-4">
          <h2 className="text-2xl font-semibold mb-4"> Dashboard Overview</h2>
          <button
            className="btn lg:hidden block text-white cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <span>&#9660; Open</span> // Opened (downward arrow)
            ) : (
              <span>&#9654; Close</span> // Closed (rightward arrow)
            )}
          </button>

          <div className="bg-white p-4 shadow rounded-lg">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-sm bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.image}
                      alt={product.image}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="pt-1 pl-1">
                      <p className="text-sm text-gray-700 font-semibold">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-700">₱{product.price}</p>
                    </div>

                    <div className="pt-1 pr-2">
                      <button
                        className="btn bg-transparent border-0"
                        onClick={handleAddToCart}
                      >
                        Add to cart
                        <svg
                          className="w-4 h-4 text-gray-600  hover:text-primary"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 21"
                        >
                          <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
