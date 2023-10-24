import React from "react";
import { useState, useEffect } from "react";
import http from "../../lib/http";
import HeroIMG from "../../assets/images/Hero/Heroimage.svg";
import Toast from "../../components/Toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const imageLink = import.meta.env.VITE_API;
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const navigate = useNavigate();
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

  async function handleAddToCart(productId) {
    if (localStorage.getItem("token")) {
      try {
        const body = {
          product_id: productId,
        };
        await api.post("/cart", body);
        window.dispatchEvent(new Event("getCartItems"));
        console.log("productId");
        setShowToast(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      navigate("/login");
    }
  }
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
        <div className="hero-overlay bg-opacity-80 "></div>
        <div className="hero-content text-center text-neutral-content ">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Discover your best skin yet!
            </h1>
            <p className="mb-5 ">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link to="/store">
              <button className="btn border-none btn-wide shadow-md transition-all  duration-700 bg-gradient-to-tl from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100">
                Shop Now
              </button>
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
                    <Link to={`/item/${product.id}`}>
                      <img
                        src={
                          product.image
                            ? `${imageLink}/public/${product.image}`
                            : ""
                        }
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-sm"
                      />{" "}
                    </Link>
                    <div className="flex justify-between">
                      <div className="pt-1">
                        <p className="text-sm text-gray-700 font-semibold">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          ₱{product.price}
                        </p>
                      </div>
                      <div className="pt-1 pr-1">
                        <button
                          className="btn bg-transparent text-xs mx-0 px-0 hover:bg-transparent hover:text-primary transition-colors font-normal border-0 "
                          onClick={() => handleAddToCart(product.id)}
                        >
                          Add to cart
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
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-sm bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Link to={`/item/${product.id}`}>
                    <img
                      src={
                        product.image
                          ? `${imageLink}/public/${product.image}`
                          : ""
                      }
                      alt={product.image}
                      loading="lazy"
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </Link>
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
                      className="btn bg-transparent text-xs mx-0 px-0 hover:bg-transparent hover:text-primary transition-colors font-normal border-0 "
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className=" justify-center flex mx-auto pt-4">
            <Link to="/store">
              <button className="btn border-none  btn-wide shadow-md transition-all duration-700 bg-gradient-to-tl from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100">
                Show more
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
