import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";


function MovieCard({ movie, pathname }) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  let history = useHistory({ forceRefresh: true });

  const imag = "https://image.tmdb.org/t/p/w500";

  let source = `${imag + movie.poster_path}`;

  function getClassByRate(vote) {
    if (vote >= 8) return "green";
    if (vote >= 5) return "orange";
    return "red";
  }

  const date = new Date(movie.release_date)
  if (source === "https://image.tmdb.org/t/p/w500null") {
    source = "https://www.eatgreenearth.com/wp-content/themes/eatgreen/images/no-image.jpg";
  }


  return (
    <div className="movie-card">
      <img className={`${pathname !== '/movie/:id' && appState.loggedIn && 'mohov'}`} src={source} alt={movie.title} />
      <div className="movie-info ">
        <div>
          <h3>{movie.title}</h3>
          <p className="date-movie">{date.toDateString()}</p>
        </div>
        <span className={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
      </div>
      {appState.loggedIn && pathname !== '/movie/:id' &&
        <div className="view-details">
          <button className="button-41" onClick={(e) => {
            history.push(`/movie/${movie.id}`);
            appDispatch({ type: "clearSerach" })
          }
          }>View Details</button>
        </div>}
    </div>
  );
}

export default MovieCard;
