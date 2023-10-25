import React, { useState, useEffect, useRef } from "react";
import http from "../../../lib/http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProducts = () => {
  const [page, setPage] = useState(1);
  const imageLink = import.meta.env.VITE_API;
  const [pageCount, setPageCount] = useState(1);
  const [productsPerPage] = useState(10);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchProducts(page);
    fetchCategories();
  }, [page]);

  async function fetchProducts(page) {
    try {
      const response = await api.request("/products", {
        params: { page },
      });

      setCurrentProducts(response.data.data);
      setPageCount(response.data.meta.last_page);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  }

  const paginate = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setPage(newPage);
    }
  };

  async function fetchCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setCurrentProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product");
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditCancel = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleUpdate = async (editedProduct) => {
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

      if (editedProduct.image) {
        formData.append("image", editedProduct.image);
      }

      const response = await api.put(
        `/products/${editedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      handleEditCancel();
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to update the product.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedProduct({
        ...selectedProduct,
        image: file,
        imagePreview: imageUrl,
      });
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider "
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Brand
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="items-center px-6 py-4">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            product.image
                              ? `${imageLink}/public/${product.image}`
                              : ""
                          }
                          alt="product image"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    // onClick={() => openModal(product)}
                    className="btn btn-warning btn-sm mx-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-error btn-sm mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <ul className="join">
            {Array.from({ length: pageCount }).map((_, index) => (
              <li key={index} className="mr-2">
                <button
                  className={`${
                    page === index + 1
                      ? "join-item btn btn-accent"
                      : "join-item btn hover:bg-gray-300 text-gray-700"
                  } px-4 py-2 rounded-md`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedProduct && (
        <div
          id="editProductModal"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
              <button
                onClick={handleEditCancel}
                className="fill-current h-6 w-6"
              >
                <svg
                  className="hover:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M14.348 4.849a1 1 0 00-1.414 0L10 8.586l-2.93-2.93a1 1 0 00-1.414 1.414L8.586 10l-2.93 2.93a1 1 0 101.414 1.414L10 11.414l2.93 2.93a1 1 0 001.414-1.414L11.414 10l2.93-2.93a1 1 0 000-1.414z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <EditProductForm
              product={selectedProduct}
              onCancel={handleEditCancel}
              onUpdate={handleUpdate}
              categories={categories}
              handleFileChange={handleFileChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProducts;
