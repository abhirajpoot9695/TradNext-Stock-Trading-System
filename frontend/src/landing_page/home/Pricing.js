import React from 'react'

function Pricing() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <h2 className='mb-4' >Unbeatable Pricing</h2>
                    <p>we pioneered the concept of discount broking and pricing transparency. Flat fees and no hidden charges. </p>
                    <a className='me-5' href="">See pricing<i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div className="col-2"></div>
                <div className="col-6">
                    <div className="row mb-5 ">
                        <div className="col text-center pt-4 pb-4 border">
                            <h1 className='mb-3'>₹0</h1>
                            <p>free equity delivery and <br /> direct mutual funds.</p>
                        </div>
                        <div className="col text-center pt-4 pb-4  border">
                            <h1 className='mb-3'>₹20</h1>
                            <p>Intraday and F&O</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;