import React from "react";

function Education() {
    return (
        <div className="container mt-5">
            <div className="row mt-5">
                <div className="col-6">
                    <img style={{ width: "80%" }} src="media/images/education.svg" alt="education" />
                </div>
                <div className="col-6 mt-5 ">
                    <h1 className="mt-3 mb-4">Free and open market education</h1>
                    <p>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
                    <a className="mt-4 mb-5" href="">Versity<i class="fa-solid fa-arrow-right"></i></a>
                    <p className="mt-3">TradingQ&A, the most active trading and investment community in India for all your market related queries.
                    </p>
                    <a href="">TradingQ&A<i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    );
}

export default Education;