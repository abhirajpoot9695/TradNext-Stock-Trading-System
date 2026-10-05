import React from 'react'

function Stats() {
    return (
        <div class="container mt-5">
            <div class="row">
                <div class="col-6 p-5 mb-5">
                    <h1 className='mb-5'>Trust with confidence.</h1>
                    <h3>Customer-first always</h3>
                    <p className='text-muted'>That's why 1.3+ crore customers trust Zerodha with 35+ lakh crores worth of equity investments.</p>
                    <h3>No spam or gimmicks</h3>
                    <p className='text-muted'>No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your
                        pace, the way you like.
                    </p>
                    <h3>The Zerodha universe</h3>
                    <p className='text-muted'>Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored
                        services specific to your needs.
                    </p>
                    <h3>Do better with money</h3>
                    <p className='text-muted'>With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you
                        do better with your money.</p>
                </div>
                <div class="col-6 ml-5">
                    <img className='ms-5' style={{ width: "80%" }} src="media/images/ecosystem.png" alt="ecosystem" />
                    <div className='text-center'>
                        <a className='me-5' href="">Explore our Products<i class="fa-solid fa-arrow-right"></i></a>
                        <a href="">Try Kite Demo</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;