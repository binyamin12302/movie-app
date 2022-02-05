import React from 'react';

function LoadingSingleMovie() {
    return (
        <>
            <div className="loadingSingleMovie" >
                <div className='content'>
                    <div className="container-movie"></div>
                    <div className="column-two">
                        <p></p>
                        <h2>{}</h2>
                        <div className='video'>
                        </div>
                    </div>

                    <div className="column-two">
                        <h2>{}</h2>
                        <div className='video'>
                        </div>
                        <h2>{}</h2>
                        <div className='video'>
                        </div>
                    </div>
                </div>



                <div className='content'>
                    <div className="column-two">
                        <p></p>
                    </div>
                    <div className="column-two">
                        <p></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoadingSingleMovie;
