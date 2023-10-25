import React, { useState, useEffect } from "react";
import http from "../../../lib/http";

const Orders = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      const response = await api.get("/orders");

      const mergedOrders = mergeOrders(response.data);
      setOrders(mergedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  function mergeOrders(data) {
    const mergedOrders = [];
    data.forEach((order) => {
      const existingOrder = mergedOrders.find(
        (mergedOrder) => mergedOrder.order_id === order.order_id
      );
      if (existingOrder) {
        existingOrder.total += order.total;
      } else {
        mergedOrders.push({ ...order });
      }
    });
    return mergedOrders;
  }

  return (
    <>
      <div className="p-4 ">
        <div>
          <h1 className="my-3 text-2xl font-semibold"> My Orders</h1>
          {orders.length > 0 ? (
            <table className="w-full border-collapse table">
              <thead>
                <tr>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Created At</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="border p-2">{order.order_id}</td>
                    <td className="border p-2">{order.created_at}</td>
                    <td className="border p-2">{order.status}</td>
                    <td className="border p-2 text-right">₱{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className=" mx-auto loading loading-dots loading-lg"></span>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
