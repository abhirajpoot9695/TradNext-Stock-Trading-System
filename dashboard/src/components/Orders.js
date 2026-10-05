import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { API_URL } from "../config";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const { refreshFlag } = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/allorders`,{withCredentials: true})
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, [refreshFlag]);

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => {
              const modeClass = order.mode === "SELL" ? "loss" : "profit";
              const time = order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-";

              return (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.price.toFixed(2)}</td>
                  <td className={modeClass}>{order.mode}</td>
                  <td>{time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
