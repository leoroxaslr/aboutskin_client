import React, { useState, useEffect } from "react";
import http from "../../../lib/http";

const Orders = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function handleChange(e) {
    setOrderId(e.target.value);
    const response = await api.get(`/order/${e.target.value}`);
    setOrder(response.data.data);

    const total = response.data.data.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }

  return (
    <>
      <div className="p-4">
        <div>
          <div className="mb-4">
            <label htmlFor="orders" className="block">
              Orders
            </label>
            <select
              id="orders"
              value={orderId}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            >
              {orders.map((order, index) => (
                <option key={index} value={order.order_id}>
                  {order.created_at} - {order.status}
                </option>
              ))}
            </select>
          </div>
          {orders.length > 0 ? (
            <table className="w-full border-collapse table">
              <thead>
                <tr>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2 text-right">Price</th>
                  <th className="border p-2 text-right">Quantity</th>
                  <th className="border p-2 text-right">Total</th>
                  <th className="border p-2">Item Type</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.product_name}</td>
                    <td className="border p-2 text-right">{item.price}</td>
                    <td className="border p-2 text-right">{item.quantity}</td>
                    <td className="border p-2 text-right">{item.total}</td>
                    <td className="border p-2">{item.item_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className=" mx-auto loading loading-dots loading-lg"></span>
          )}

          <h1 className="text-2xl mt-4">
            Total Price: ₱{totalPrice.toFixed(2)}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Orders;
