import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { API_URL } from "../config";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const generalContext = useContext(GeneralContext);
  const { refreshFlag } = generalContext;

  useEffect(() => {
    axios
      .get(`${API_URL}/allpositions`,{withCredentials: true})
      .then((res) => {
        setAllPositions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
      });
  }, [refreshFlag]);

  const handleSellClick = (stock) => {
    generalContext.openSellWindow(stock.name, stock.qty, stock.price, "MIS");
  };

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                  <td>
                    <button className="sell" onClick={() => handleSellClick(stock)}>
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
