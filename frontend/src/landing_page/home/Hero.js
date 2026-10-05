import React from 'react'

function Hero() {
    return (
        <div className='container mb-5'>
            <div class="row text-center">
                <img src="media/images/homeHero.png" alt="HomeHero" className="mb-5" />
                <h1 className="mt-5">Invest in EveryThing</h1>
                <p>Online platform to invest in stocks, deriatives, mutualo fund, and more </p>
                <button className='p-2 btn btn-primary fs-5 mb-5' style={{ width: "20%", margin: "0 auto" }}>Signup now</button>
            </div>
        </div>
    );
}

export default Hero;