import React from "react";
import { useState, useEffect } from "react";
import http from "../../lib/http";
import HeroIMG from "../../assets/images/Hero/Heroimage.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const imageLink = import.meta.env.VITE_API;
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

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
        toast.success("Item added to the cart");
      } catch (e) {
        console.log(e);
        toast.error("Failed to add item to the cart");
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
      <ToastContainer />
      <div
        className="hero min-h-[500px]"
        style={{
          backgroundImage: `url(${HeroIMG})`,
        }}
      >
        <div className="hero-overlay bg-opacity-80 "></div>
        <div className="hero-content text-neutral-content ">
          <div className="max-w-">
            <h1 className="mb-5 text-8xl font-bold text-base-100 text-left w-10/12">
              Discover your best skin yet!
            </h1>
            <p className="mb-5 text-base-100  ">
              Constantly transforming and elevating the beauty shopping
              experience.
            </p>
            <Link to="/store">
              <button className="btn border-none  btn-wide shadow-md bg-secondary hover:bg-accent">
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
                      />
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
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-sm"
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
              <button className="btn border-none btn-wide shadow-md bg-secondary hover:bg-accent">
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
