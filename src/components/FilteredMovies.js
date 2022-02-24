import React, { useContext } from 'react';
import StateContext from "../StateContext";
import LoadingSniper from './loading/LoadingSniper';
import MovieCard from "./MovieCard.js";
import NotFound from "./NotFound.js";


function FilteredMovies() {
    const appState = useContext(StateContext);

    const filteredMovies = appState.filteredMovies &&
        appState.filteredMovies.map((movie, index) => <MovieCard movie={movie} key={index} />)

    const filteredMoviesResults = appState.filteredMovies?.length === 0 && appState.searchInput !== "" ? <NotFound />
        : filteredMovies

    return (
        <div id='search-filter'>
            {
                !appState.filteredMovies ? <LoadingSniper /> :
                    <div className="container-movie  user-movies"> {filteredMoviesResults} </div>
            }
        </div>
    )
}

export default FilteredMovies;
