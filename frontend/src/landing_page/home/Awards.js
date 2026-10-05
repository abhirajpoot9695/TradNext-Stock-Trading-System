import React from "react";
function Awards() {
    return (
        <div class="container mt-5">
            <div class="row">
                <div class="col-6 p-5">
                    <img src="media/images/largestBroker.svg" alt="largestBroker" />
                </div>
                <div class="col-6 mt-5 p-5">
                    <h1>Largest stock broker in India</h1>
                    <p className="mb-5">2+ million Zerodha clients contribute t over 15% of all retail order volumesin india daily by trading and
                        investing in:</p>
                    <div class="row mb-4">
                        <div class="col-6">
                            <ul>
                                <li>Futures and options.</li>
                                <li>Commodity dervatives</li>
                                <li>Currency derivatives</li>
                            </ul>
                        </div>
                        <div class="col-6">
                            <ul>
                                <li>Stocks and IPOs</li>
                                <li>Direct mutual funds</li>
                                <li>Bonds and govt. Securities</li>
                            </ul>
                        </div>
                    </div>
                    <img style={{ width: "90%" }} src="media/images/pressLogos.png" alt="pressLogos" />
                </div>
            </div>
        </div>
    );
}

export default Awards;