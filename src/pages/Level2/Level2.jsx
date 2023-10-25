import React from "react";
import { useState, useEffect } from "react";
import http from "../../lib/http";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { toast, ToastContainer } from "react-toastify";

const Level2 = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const imageLink = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(0);
  const [rating, setRating] = useState();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [newPriceRange, setNewPriceRange] = useState([0, 1000]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("none");
  const [asc, setAsc] = useState("asc");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    getCategories();
    getFilteredProducts(null);
    return () => {};
  }, []);

  useEffect(() => {
    getFilteredProducts();
    console.log(rating);
    return () => {};
  }, [category, priceRange, sort, asc, search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPriceRange(newPriceRange);
    }, 1000);
    return () => {
      clearTimeout(delay);
    };
  }, [newPriceRange]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(delay);
    };
  }, [searchQuery]);

  async function getFilteredProducts(_, page = 1) {
    console.log(sort);
    const options = {
      params: {
        search,
        page,
        sort: sort === "rating" ? "rating" : "none",
        category,
        rating,
        asc,
        "min-price": priceRange[0],
        "max-price": priceRange[1],
      },
    };
    const response = await api.request("/products/filter", options);
    setPage(page);
    setPageCount(response.data?.meta?.last_page);
    setProducts(response.data?.data);
  }
  useEffect(() => {
    async function fetchData() {
      const response = await api.request("/products", {
        params: { page },
      });
      setPageCount(response.data.meta.last_page);
      setProducts(response.data.data);
    }

    fetchData();
  }, [page]);

  async function getCategories() {
    const response = await api.get("/categories");
    setCategories(response.data.data);
  }

  async function addToCart(productId) {
    if (localStorage.getItem("token")) {
      try {
        const body = {
          product_id: productId,
        };
        await api.post("/cart", body);
        window.dispatchEvent(new Event("getCartItems"));
        toast.success("Item added to the cart");
      } catch (e) {
        console.log(e);
        toast.error("Failed to add item to the cart");
      }
    } else {
      navigate("/login");
    }
  }
  const loadNextPage = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };
  const loadPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleRatingSort = (selectedRating) => {
    // Update the sort state to "rating" and the rating state to the selected rating value
    setSort("rating");
    setRating(selectedRating);
    getFilteredProducts(); // Trigger product sorting
  };

  return (
    <>
      <ToastContainer />
      <div className="container md:mx-auto p-4 md:flex ">
        <div className="w-full p-4 sm:w-2/5 md:w-2/5 lg:w-1/5 xl:w-1/5">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex">
            SEARCH FILTER
          </h2>
          <div className="divider"></div>
          <div className=" p-4 rounded-lg">
            <label className="block mb-2 font-light tracking-tight">
              By Rating
            </label>
            <div className="rating">
              <div className="rating">
                <input
                  type="radio"
                  name="rating-2"
                  value="1"
                  onClick={() => handleRatingSort(1)}
                  className="mask mask-star-2 bg-success"
                />
                <input
                  type="radio"
                  name="rating-2"
                  value="2"
                  onClick={() => handleRatingSort(2)}
                  className="mask mask-star-2 bg-success"
                />
                <input
                  type="radio"
                  name="rating-2"
                  value="3"
                  onClick={() => handleRatingSort(3)}
                  className="mask mask-star-2 bg-success"
                />
                <input
                  type="radio"
                  name="rating-2"
                  value="4"
                  onClick={() => handleRatingSort(4)}
                  className="mask mask-star-2 bg-success"
                />
                <input
                  type="radio"
                  name="rating-2"
                  value="5"
                  onClick={() => handleRatingSort(5)}
                  className="mask mask-star-2 bg-success"
                />
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className=" p-4 rounded-lg">
            <label className="block mb-2 font-light tracking-tight">
              {" "}
              By Category
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="category"
                  value="0"
                  onChange={(e) => setCategory(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="font-light tracking-tight">All</span>
              </label>
              {categories.map((category, index) => {
                return (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      onChange={(e) => setCategory(e.target.value)}
                      className="radio radio-primary "
                    />
                    <span className="font-light tracking-tight">
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="divider"></div>
          <div className=" p-4 rounded-lg mt-4">
            <label className="block mb-2 font-light tracking-tight">
              Ascending/Descending
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sort-by-ad"
                  value="asc"
                  onChange={(e) => setAsc(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="font-light tracking-tight">Ascending</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sort-by-ad"
                  value="desc"
                  onChange={(e) => setAsc(e.target.value)}
                  className="radio radio-primary focus:ring-primary"
                />
                <span className="font-light tracking-tight">Descending</span>
              </label>
            </div>
          </div>
          <div className="divider"></div>
          <div className=" p-4 rounded-lg mt-4">
            <label className="block mb-2 font-light tracking-tight">
              Price Range
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={newPriceRange[0]}
              onChange={(e) =>
                setNewPriceRange([e.target.value, priceRange[1]])
              }
              className="w-full range range-success"
              data-tip={newPriceRange[0]}
            />
            <div className="flex justify-between ">
              <span className="font-light tracking-tight">
                {newPriceRange[0]}
              </span>
              <span className="font-light tracking-tight">
                {newPriceRange[1]}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full ">
          <div className="flex flex-none w-11/12 justify-between">
            <div className=" p-4 rounded-lg flex ">
              <label className="block mb-2 font-bold tracking-tight">
                Sort by:
              </label>
              <div className="flex">
                <label className="flex mx-2">
                  <input
                    type="radio"
                    name="sort-by"
                    value="none"
                    onChange={(e) => setSort(e.target.value)}
                    className="radio radio-primary"
                  />
                  <span className="font-light tracking-tight ml-1">None</span>
                </label>
                <label className="flex mx-2">
                  <input
                    type="radio"
                    name="sort-by"
                    value="price"
                    onChange={(e) => setSort(e.target.value)}
                    className="radio radio-primary"
                  />
                  <span className="font-light tracking-tight ml-1">
                    Price Range
                  </span>
                </label>
                <label className="flex mx-2">
                  <input
                    type="radio"
                    name="sort-by"
                    value="name"
                    onChange={(e) => setSort(e.target.value)}
                    className="radio radio-primary"
                  />
                  <span className="font-light tracking-tight ml-1">Name</span>
                </label>
              </div>
            </div>

            <div className="join sm:my-auto shadow-sm">
              <button
                className="join-item btn btn-base-100 "
                onClick={loadPrevPage}
              >
                ←
              </button>
              <button className="join-item btn btn-base-100">{page}</button>
              <button
                className="join-item btn btn-base-100"
                onClick={loadNextPage}
              >
                →
              </button>
            </div>
          </div>
          <div className="mx-auto">
            <div className="grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-1">
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
                          alt=""
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
                        <div className="pt-1 pr-1">
                          <button
                            className="btn bg-transparent text-xs mx-0 px-0 hover:bg-transparent hover:text-primary transition-colors font-normal border-0 "
                            onClick={() => addToCart(product.id)}
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
          <Pagination
            count={pageCount}
            page={page}
            onChange={getFilteredProducts}
            className="flex justify-center mt-8"
            buttonClass="px-4 py-2 border rounded-full mx-2 hover:bg-blue-500 hover:text-white"
            activeButtonClass="bg-blue-500 text-white"
            disabledButtonClass="text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>
    </>
  );
};

export default Level2;
