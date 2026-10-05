import React, { useContext, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import GeneralContext from "./GeneralContext";
import "./AnalyticsWindow.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Generates a plausible-looking price history ending at the current price.
// Replace this with a real fetch to a historical-prices endpoint once
// your backend has one (e.g. GET /history/:name).
function generatePriceHistory(currentPrice, days = 30) {
    const prices = [currentPrice];
    let price = currentPrice;

    for (let i = 1; i < days; i++) {
        const changePercent = (Math.random() - 0.5) * 0.04; // +/-2% daily swing
        price = price / (1 + changePercent);
        prices.unshift(Number(price.toFixed(2)));
    }

    return prices;
}

const AnalyticsWindow = ({ stock }) => {
    const { closeAnalyticsWindow } = useContext(GeneralContext);

    const currentPrice = Number(stock.price) || 0;
    const isDown = !!stock.isDown;

    const history = useMemo(
        () => generatePriceHistory(currentPrice, 30),
        [currentPrice]
    );

    const dayHigh = Math.max(...history);
    const dayLow = Math.min(...history);
    const lineColor = isDown ? "#eb5b3c" : "#4184f3";

    const labels = history.map((_, i) => `D-${history.length - i}`);

    const data = {
        labels,
        datasets: [
            {
                label: `${stock.name} price`,
                data: history,
                borderColor: lineColor,
                backgroundColor: `${lineColor}22`,
                pointRadius: 0,
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => `₹${value}`,
                },
            },
        },
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeAnalyticsWindow();
        }
    };

    return (
        <div className="analytics-overlay" onClick={handleOverlayClick}>
            <div className="analytics-container">
                <div className="analytics-header">
                    <div>
                        <h3>{stock.name}</h3>
                        <p className={isDown ? "down" : "up"}>
                            ₹{currentPrice.toFixed(2)}{" "}
                            {stock.percent && <span>({stock.percent})</span>}
                        </p>
                    </div>
                    <button className="close-btn" onClick={closeAnalyticsWindow}>
                        ✕
                    </button>
                </div>

                <div className="analytics-chart">
                    <Line data={data} options={options} />
                </div>

                <div className="analytics-stats">
                    <div className="stat">
                        <p className="stat-label">30D High</p>
                        <p className="stat-value">₹{dayHigh.toFixed(2)}</p>
                    </div>
                    <div className="stat">
                        <p className="stat-label">30D Low</p>
                        <p className="stat-value">₹{dayLow.toFixed(2)}</p>
                    </div>
                    <div className="stat">
                        <p className="stat-label">Current</p>
                        <p className="stat-value">₹{currentPrice.toFixed(2)}</p>
                    </div>
                </div>

                <p className="analytics-disclaimer">
                    Simulated trend for demo purposes — connect a real price-history
                    endpoint to replace this data.
                </p>
            </div>
        </div>
    );
};

export default AnalyticsWindow;
