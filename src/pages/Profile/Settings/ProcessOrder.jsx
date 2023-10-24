import React, { useState, useEffect } from "react";
import http from "../../../lib/http";

const ProcessOrder = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch orders when the component mounts
    getOrders();
  }, []);

  async function getOrders() {
    const response = await api.get("/allorder");
    setOrders(response.data);
  }

  async function handleChange(e) {
    const selectedValue = e.target.value;
    setSelectedDate(selectedValue);

    const filteredOrders = orders[selectedValue] || [];

    // Calculate the total price for the filtered orders
    const total = filteredOrders.reduce((acc, item) => acc + item.total, 0);
    setTotalPrice(total);

    setOrder(filteredOrders);
  }

  console.log(order);

  return (
    <>
      <div className="p-4">
        <div>
          <div className="mb-4">
            <label htmlFor="date" className="block">
              Select Date
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            >
              <option value="">Select a date</option>
              {Object.keys(orders).map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full border-collapse table">
            <thead>
              <tr>
                <th className="border p-2">Customer_order_number</th>
                <th className="border p-2">Consginee_name</th>
                <th className="border p-2">Addess</th>
              </tr>
            </thead>
            <tbody>
              {order.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.order_id}</td>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.order_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
