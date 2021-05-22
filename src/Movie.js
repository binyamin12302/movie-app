import React from "react";
import "./Movie.css";

function Movie(props) {
  const imag = "https://image.tmdb.org/t/p/w500";
  const movie = props.movie;

  function getClassByRate(vote) {
    if (vote >= 8) {
      return "green";
    } else if (vote >= 5) {
      return "orange";
    } else {
      return "red";
    }
  }

  return (
    <>
      <div className="movie">
        <img src={`${imag + movie.poster_path}`} alt={movie.title} />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <span className={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
        </div>
        <div className="overview">
          <h3>Overview</h3>
          {movie.overview}
        </div>
      </div>
    </>
  );
}

export default Movie;
