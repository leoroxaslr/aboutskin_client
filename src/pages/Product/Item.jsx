import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../../lib/http";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Item = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const imageLink = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [ratingData, setRatingData] = useState(null);

  const { id } = useParams();

  async function fetchData() {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setRatingData(response.data);
      const originalstock = response.data.stock;
      const trimmedstock = Math.floor(originalstock);
      setStock(trimmedstock);
    } catch (e) {
      console.error("Error fetching product:", e);
    } finally {
      setLoading(false);
    }
  }

  async function getFilteredProducts() {
    const response = await api.request("/products");
    setProducts(response.data?.data);
  }

  useEffect(() => {
    fetchData();
    getFilteredProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  async function addToCart(productId) {
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
  const renderStarRating = () => {
    if (ratingData && ratingData.rating) {
      const maxRating = 5;
      const rating = ratingData.rating;
      const stars = [];

      for (let i = 1; i <= maxRating; i++) {
        stars.push(
          <input
            key={i}
            type="radio"
            name={`rating-${rating}`}
            className="mask mask-star bg-orange-400"
            checked={i <= rating}
            disabled
          />
        );
      }

      return <div className="rating">{stars}</div>;
    } else {
      return <div>Loading rating data...</div>;
    }
  };

  return (
    <div>
      {product ? (
        <div className="container mx-auto w-8/12 my-10">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/store">Store</Link>
              </li>
              <li>{product.name}</li>
            </ul>
          </div>
          <div className="card lg:card-side bg-base-100 my-10 w-10/12">
            <img
              src={product.image ? `${imageLink}/public/${product.image}` : ""}
              className="aspect-h-1 aspect-w-1 sm:w-1/2 w-full p-4 lg:aspect-none rounded-lg"
              alt="Album"
            />

            <div className="card-body -tracking-tight">
              {renderStarRating()}
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <p>Stocks: {stock}</p>
              <div className="flex justify-between">
                <h2 className=" text-sm my-auto mx-2">Quantity</h2>
                <div className="join my-auto ">
                  <button className="join-item btn rounded-none bg-transparent">
                    -
                  </button>
                  <button className="join-item btn font-light text-sm bg-transparent">
                    1
                  </button>
                  <button className="join-item btn rounded-none bg-transparent">
                    +
                  </button>
                </div>
                <div className="card-actions">
                  <button
                    className="btn bg-transparent text-sm font-normal border-0 "
                    onClick={() => addToCart(product.id)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-6 sm:pb-32 lg:max-w-7xl  lg:px-8">
              <div className="divider"></div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Product Details
                </h2>
                <p className="mt-4 text-gray-500">{product.description_long}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Product Not Found</h2>
        </div>
      )}
      <div className="container mx-auto w-8/12 my-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Discover more
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-10  md:gap-x-20 xl:gap-x-20">
          {products &&
            products.map((product, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-64">
                <div className="aspect-h-1 aspect-w-1 w-full p-4 rounded-md lg:aspect-none group-hover:opacity-75 ">
                  <Link
                    key={product.id}
                    to={`/item/${product.id}`}
                    className="group"
                  >
                    <img
                      src={
                        product.image
                          ? `${imageLink}/public/${product.image}`
                          : ""
                      }
                      alt={product.image}
                      loading="lazy"
                      className="h-full w-full object-cover object-center group-hover:opacity-75 rounded-xl"
                    />
                  </Link>
                  <div className="flex justify-between">
                    <div className="pt-1">
                      <p className="text-sm text-gray-700 font-semibold tracking-tight">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-700 font-light">
                        ₱{product.price}
                      </p>
                    </div>
                    <div className="pt-4 pr-1">
                      <button onClick={() => addToCart(product.id)}>
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
        <div className=" justify-center flex mx-auto pt-4">
          <Link to="/store">
            <button className="btn btn-wide btn-primary">Show more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Item;
