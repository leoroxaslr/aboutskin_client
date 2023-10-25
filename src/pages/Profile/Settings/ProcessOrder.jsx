import React, { useState, useEffect } from "react";
import http from "../../../lib/http";
import { CSVLink } from "react-csv";

const ProcessOrder = () => {
  const api = http({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
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

    const total = filteredOrders.reduce((acc, item) => acc + item.total, 0);
    setTotalPrice(total);

    setOrder(filteredOrders);
  }

  function formatDataForCSV() {
    return order.map((item) => [
      item.order_id,
      item.customer_name,
      item.address,
      item.postal_code,
      item.phone_number,
      item.total,
      item.payment_type,
      item.item_type,
      item.weight,
      item.length,
      item.width,
      item.height,
    ]);
  }
  const today = Date.now();

  return (
    <>
      <div className="p-4">
        <div>
          <div className="mb-4">
            <label htmlFor="date" className="block font-bold ">
              Select Date
            </label>
            <p className="font-light mb-3 text-sm">Export to ship</p>
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
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows">
              <thead>
                <tr>
                  <th className="border p-2">Customer Order Number</th>
                  <th className="border p-2">Consginee Name</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Postal Code</th>
                  <th className="border p-2">Phone Number</th>
                  <th className="border p-2">Total Price</th>
                  <th className="border p-2">Payment Type</th>
                  <th className="border p-2">Item Type</th>
                  <th className="border p-2">Weight</th>
                  <th className="border p-2">Length</th>
                  <th className="border p-2">Width</th>
                  <th className="border p-2">Height</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.order_id}</td>
                    <td className="border p-2">{item.customer_name}</td>
                    <td className="border p-2">{item.address}</td>
                    <td className="border p-2">{item.postal_code}</td>
                    <td className="border p-2">{item.phone_number}</td>
                    <td className="border p-2">{item.total}</td>
                    <td className="border p-2">{item.payment_type}</td>
                    <td className="border p-2">{item.item_type}</td>
                    <td className="border p-2">{item.weight}</td>
                    <td className="border p-2">{item.length}</td>
                    <td className="border p-2">{item.width}</td>
                    <td className="border p-2">{item.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CSVLink
          data={formatDataForCSV()}
          filename={"orders.csv"}
          className="export-csv-link btn btn-accent my-3 "
        >
          Export to CSV
        </CSVLink>
      </div>
    </>
  );
};

export default ProcessOrder;
