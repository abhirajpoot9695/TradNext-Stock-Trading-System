import React, { createContext, useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import AnalyticsWindow from "./AnalyticsWindow";

const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellStockUID, setSelectedSellStockUID] = useState("");
  const [selectedSellMaxQty, setSelectedSellMaxQty] = useState(null);
  const [selectedSellPrice, setSelectedSellPrice] = useState(null);
  const [selectedSellProduct, setSelectedSellProduct] = useState(null);

  const [isAnalyticsWindowOpen, setIsAnalyticsWindowOpen] = useState(false);
  const [analyticsStock, setAnalyticsStock] = useState(null);

  const [refreshFlag, setRefreshFlag] = useState(0);
  const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

  const openBuyWindow = (uid) => {
    setSelectedStockUID(uid);
    setIsBuyWindowOpen(true);
  };

  const closeBuyWindow = () => {
    setSelectedStockUID("");
    setIsBuyWindowOpen(false);
  };

  // product: pass "CNC" from Holdings, "MIS" from Positions, or leave null
  // (e.g. from Watchlist) to let the user choose in the Sell window
  const openSellWindow = (uid, qty = null, price = null, product = null) => {
    setSelectedSellStockUID(uid);
    setSelectedSellMaxQty(qty);
    setSelectedSellPrice(price);
    setSelectedSellProduct(product);
    setIsSellWindowOpen(true);
  };

  const closeSellWindow = () => {
    setSelectedSellStockUID("");
    setSelectedSellMaxQty(null);
    setSelectedSellPrice(null);
    setSelectedSellProduct(null);
    setIsSellWindowOpen(false);
  };

  const openAnalyticsWindow = (stock) => {
    setAnalyticsStock(stock);
    setIsAnalyticsWindowOpen(true);
  };

  const closeAnalyticsWindow = () => {
    setAnalyticsStock(null);
    setIsAnalyticsWindowOpen(false);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        closeBuyWindow,
        openSellWindow,
        closeSellWindow,
        openAnalyticsWindow,
        closeAnalyticsWindow,
        refreshFlag,
        triggerRefresh,
      }}
    >
      {children}

      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}

      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedSellStockUID}
          maxQty={selectedSellMaxQty}
          defaultPrice={selectedSellPrice}
          defaultProduct={selectedSellProduct}
        />
      )}

      {isAnalyticsWindowOpen && analyticsStock && (
        <AnalyticsWindow stock={analyticsStock} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;