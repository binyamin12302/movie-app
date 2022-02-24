import React, { useContext } from "react";
import StateContext from "../../StateContext";

function LoadingCard() {
    const appState = useContext(StateContext);
    
    return (
        <>
            {Array.from(appState.loggedIn ? Array(20) : Array(4), (_, i) =>
                <div className="movie-card box" key={i}>
                    <div className="card card-loading">
                        <div className="image"></div>
                        <div className="content">
                            <h2> </h2>
                            <p></p>
                        </div>
                    </div>
                </div>)}
        </>
    )
}

export default LoadingCard;
