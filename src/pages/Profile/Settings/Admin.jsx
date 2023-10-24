import React from "react";
import { useState, useEffect, useRef } from "react";
import http from "../../../lib/http";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    description_long: "",
    price: 0,
    stock: 0,
    rating: 0,
    category_id: 1,
    image: null, // Change the initial value to null
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("description", product.description);
      formData.append("description_long", product.description_long);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("rating", product.rating);
      formData.append("category_id", product.category_id);

      // Append the image to the FormData
      if (product.image) {
        formData.append("image", product.image);
      }

      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProduct({
        name: "",
        brand: "",
        description: "",
        description_long: "",
        price: 0,
        stock: 0,
        rating: 0,
        category_id: 1,
        image: null, // Reset the image field
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to add a new product.");
    }
  };

  const handleImageChange = (e, fromDrop = false) => {
    const file = fromDrop ? e.dataTransfer.files[0] : e.target.files[0];

    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      // Update the 'product' object if it exists in your component state
      if (product) {
        setProduct({
          ...product,
          image: file,
        });
      }
    } else {
      setSelectedImage(null);
      setImagePreview(null);

      // Clear the image in the 'product' object if it exists in your component state
      if (product) {
        setProduct({
          ...product,
          image: null,
        });
      }
    }
  };

  const handleFileChange = (e) => {
    handleImageChange(e, false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageChange(e, true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <ToastContainer />
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Add New Product
      </h2>
      <p className="mb-2 text-sm leading-6 text-gray-600">Basic information</p>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type product name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              id="brand"
              className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Product brand"
              required
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              id="price"
              className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Product brand"
              required
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              id="stock"
              className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Product brand"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Category
            </label>
            <select
              name="category_id"
              required
              value={product.category_id}
              onChange={handleChange}
              className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
            >
              {Array.isArray(categories) ? (
                categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="1">Loading categories...</option>
              )}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Description
            </label>
            <textarea
              type="text"
              required
              name="description"
              value={product.description}
              onChange={handleChange}
              id="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 "
              placeholder="Write product description here"
            ></textarea>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Description Long
            </label>
            <textarea
              type="text"
              name="description_long"
              value={product.description_long}
              onChange={handleChange}
              id="description"
              rows="4"
              required
              className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 "
              placeholder="Write product description here"
            ></textarea>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Image
            </label>
            <div className="w-full h-40 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
              <input
                required
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-ghost w-full max-w-xs"
                ref={fileInputRef}
              />
              {product.image ? ( // Check if product.image is set
                <img
                  src={URL.createObjectURL(product.image)} // Display the uploaded image
                  alt="Product Image"
                  className="w-24 h-24 aspect-square object-cover rounded-sm"
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">
                    Drag and drop an image here or click to select one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-accent">
          Add new product
        </button>
      </form>
    </>
  );
};

export default Admin;
