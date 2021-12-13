import React, { useContext } from "react";
import StateContext from "../StateContext";

function Movie(props) {
  const appState = useContext(StateContext);
  const imag = "https://image.tmdb.org/t/p/w500";
  const movie = props.movie;

  let source = `${imag + movie.poster_path}`;

  if (source === "https://image.tmdb.org/t/p/w500null") {
    source = "https://img.icons8.com/carbon-copy/900/000000/no-image.png";
  }

  function getClassByRate(vote) {
    if (vote >= 8) return "green";
    if (vote >= 5) return "orange";
    return "red";
  }

  return (
    <>
      <div className="movie-card">
        <img src={source} alt={movie.title} />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <span className={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
        </div>
        {appState.loggedIn && <div className="overview">
          <h3>Overview</h3>
          {movie.overview}
        </div>}
      </div>
    </>
  );
}

export default Movie;
