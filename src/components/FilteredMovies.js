import React, { useContext } from 'react';
import StateContext from "../StateContext";
import LoadingSniper from './loading/LoadingSniper';
import MovieCard from "./MovieCard";
import NotFound from "./NotFound";

function FilteredMovies() {
  const appState = useContext(StateContext);

  if (!appState.filteredMovies) {
    return (
      <div id="search-filter">
        <LoadingSniper />
      </div>
    );
  }

  if (appState.filteredMovies.length === 0 && appState.searchInput !== "") {
    return (
      <div id="search-filter">
        <NotFound />
      </div>
    );
  }

  return (
    <div id="search-filter">
      <div className="container-movie" id="filter-movie">
        {appState.filteredMovies.map((movie, index) => (
          <MovieCard movie={movie} key={index} />
        ))}
      </div>
    </div>
  );
}

export default FilteredMovies;
