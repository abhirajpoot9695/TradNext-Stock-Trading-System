import React, { useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { API_URL } from "../config";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, maxQty, defaultPrice, defaultProduct }) => {
    const [stockQuantity, setStockQuantity] = useState(maxQty || 1);
    const [stockPrice, setStockPrice] = useState(defaultPrice || 0);
    const [product, setProduct] = useState(defaultProduct || "CNC");
    const [error, setError] = useState("");

    const { closeSellWindow, triggerRefresh } = useContext(GeneralContext);

    const handleQtyChange = (e) => {
        const value = e.target.value;
        setStockQuantity(value);

        if (maxQty && Number(value) > maxQty) {
            setError(`You only hold ${maxQty} shares of ${uid}`);
        } else {
            setError("");
        }
    };

    const handleSellClick = async () => {
        if (maxQty && Number(stockQuantity) > maxQty) {
            setError(`You only hold ${maxQty} shares of ${uid}`);
            return;
        }

        try {
            setError("");
            await axios.post(`${API_URL}/newOrder`, {
                name: uid,
                qty: Number(stockQuantity),
                price: Number(stockPrice),
                mode: "SELL",
                product,
            },
 {
     withCredentials: true
  });
            triggerRefresh();
            closeSellWindow();
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Something went wrong placing the sell order");
        }
    };

    const handleCancelClick = () => {
        closeSellWindow();
    };

    return (
        <div className="container" id="sell-window">
            <div className="header header-sell">
                <h3>
                    Sell {uid} <span>NSE</span>
                </h3>
            </div>

            <div className="regular-order">
                {!defaultProduct && (
                    <div className="market-options" style={{ marginBottom: "12px" }}>
                        <label>
                            <input
                                type="radio"
                                name="sell-product"
                                value="CNC"
                                checked={product === "CNC"}
                                onChange={() => setProduct("CNC")}
                            />
                            Delivery (CNC)
                        </label>
                        <label style={{ marginLeft: "16px" }}>
                            <input
                                type="radio"
                                name="sell-product"
                                value="MIS"
                                checked={product === "MIS"}
                                onChange={() => setProduct("MIS")}
                            />
                            Intraday (MIS)
                        </label>
                    </div>
                )}

                <div className="inputs">
                    <fieldset>
                        <legend>Qty.{maxQty ? ` (max ${maxQty})` : ""}</legend>

                        <input
                            type="number"
                            value={stockQuantity}
                            min="1"
                            max={maxQty || undefined}
                            onChange={handleQtyChange}
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

                {error && <p className="sell-error">{error}</p>}
            </div>

            <div className="buttons">
                <span>{uid}</span>

                <div>
                    <button
                        className="btn btn-red"
                        onClick={handleSellClick}
                        disabled={!!error}
                    >
                        Sell
                    </button>

                    <button className="btn btn-grey" onClick={handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellActionWindow;
