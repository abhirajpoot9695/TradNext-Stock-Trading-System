import React, { useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { API_URL } from "../config";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);
  const [product, setProduct] = useState("CNC");

  const { closeBuyWindow, triggerRefresh } = useContext(GeneralContext);

  const handleBuyClick = async () => {
    try {
      await axios.post(`${API_URL}/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
        product,
      },
  {
    withCredentials: true,
  },);
      triggerRefresh();
      closeBuyWindow();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window">
      <div className="header">
        <h3>
          Buy {uid} <span>NSE</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="market-options" style={{ marginBottom: "12px" }}>
          <label>
            <input
              type="radio"
              name="buy-product"
              value="CNC"
              checked={product === "CNC"}
              onChange={() => setProduct("CNC")}
            />
            Delivery (CNC)
          </label>
          <label style={{ marginLeft: "16px" }}>
            <input
              type="radio"
              name="buy-product"
              value="MIS"
              checked={product === "MIS"}
              onChange={() => setProduct("MIS")}
            />
            Intraday (MIS)
          </label>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              value={stockQuantity}
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>

            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>

        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>

          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
