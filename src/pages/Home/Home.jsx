import React from "react";
import { useState, useEffect } from "react";
import http from "../../lib/http";
import HeroIMG from "../../assets/images/Hero/Heroimage.svg";
import Toast from "../../components/Toast";
import { Link } from "react-router-dom";

const Home = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);

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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);
  const limitedProducts = shuffledProducts.slice(0, 16);

  return (
    <>
      <div>
        {showToast && (
          <Toast
            message={
              <div className="alert shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">Added to Cart!</h3>
                  <div className="text-xs">
                    The item has been added to your cart.
                  </div>
                </div>
                <button className="btn">See</button>
              </div>
            }
            onClose={() => setShowToast(false)}
          />
        )}
      </div>

      <div
        className="hero min-h-[500px]"
        style={{
          backgroundImage: `url(${HeroIMG})`,
        }}
      >
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Discover your best skin yet!
            </h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link to="/store">
              <button className="btn btn-secondary">Shop Now</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-base-100">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Recommended for You
          </h2>
          <div className="w-full pb-10">
            <div className="flex items-center space-x-4 overflow-x-auto py-2 h-[380px]">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <div className="aspect-h-1 aspect-w-1 w-full p-4 rounded-md lg:aspect-none group-hover:opacity-75 ">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-sm"
                    />
                    <div className="flex justify-between">
                      <div className="pt-1">
                        <p className="text-sm text-gray-700 font-semibold">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          ₱{product.price}
                        </p>
                      </div>
                      <div className="pt-4 pr-1">
                        <button onClick={handleAddToCart}>
                          <svg
                            className="w-5 h-5 text-gray-600 hover:text-primary"
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
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Discover more
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {limitedProducts.map((product) => (
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
          <div className="grid content-center pt-4">
            <button className="btn btn-secondary">Show more</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
