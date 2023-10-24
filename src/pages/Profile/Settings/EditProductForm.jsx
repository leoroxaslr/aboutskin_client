import React, { useState, useRef } from "react";
import http from "../../../lib/http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductForm = ({ product, onUpdate, onCancel, categories }) => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [editedProduct, setEditedProduct] = useState(product);

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Update button clicked");

    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });

    // Check if any changes were made before updating
    if (JSON.stringify(product) === JSON.stringify(editedProduct)) {
      onCancel();
      return;
    }

    try {
      let formData = new FormData();
      formData.append("name", editedProduct.name);
      formData.append("brand", editedProduct.brand);
      formData.append("description", editedProduct.description);
      formData.append("description_long", editedProduct.description_long);
      formData.append("price", editedProduct.price);
      formData.append("stock", editedProduct.stock);
      formData.append("rating", editedProduct.rating);
      formData.append("category_id", editedProduct.category_id);

      // Append the image to the FormData
      if (editedProduct.image) {
        formData.append("image", editedProduct.image);
      }

      const response = await api.put(`/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      onCancel();
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to update the product.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setEditedProduct({
        ...editedProduct,
        image: file,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="m-4">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Edit Product
        </h2>
        <p className="mb-2 text-sm leading-6 text-gray-600">
          Basic information
        </p>
        <form encType="multipart/form-data" onSubmit={handleUpdate}>
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
                value={editedProduct.name}
                onChange={handleChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type product name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={editedProduct.brand}
                onChange={handleChange}
                id="brand"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Product brand"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleChange}
                id="price"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Product price"
                required
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={editedProduct.stock}
                onChange={handleChange}
                id="stock"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Product stock"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category_id"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <select
                name="category_id"
                required
                value={editedProduct.category_id}
                onChange={handleChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                type="text"
                required
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                id="description"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write product description here"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description_long"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Long Description
              </label>
              <textarea
                type="text"
                required
                name="description_long"
                value={editedProduct.description_long}
                onChange={handleChange}
                id="description_long"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write long product description here"
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
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-ghost w-full max-w-xs"
                  ref={fileInputRef}
                />
                {editedProduct.image ? (
                  <img
                    src={imagePreview}
                    alt="Product Image"
                    className="w-24 h-24 aspect-square object-cover rounded-sm mx-2"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-error mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-accent">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProductForm;
