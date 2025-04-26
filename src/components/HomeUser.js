import Axios from "axios";
import React, { useCallback, useContext, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import LoadingCard from "./loading/LoadingCard.js";
import MovieCard from "./MovieCard.js";

function HomeUser({ location }) {
  const appState = useContext(StateContext);
  const initialUrl = `https://api.themoviedb.org/3/`;

  const currentClassName = JSON.parse(localStorage.getItem('currentClassName'));

  const initialState = {
    results: null,
    total_pages: JSON.parse(localStorage.getItem('totalPages')) || 500,
    currentPage: JSON.parse(localStorage.getItem('pageNumber')) || 1,
    baseUrl: JSON.parse(localStorage.getItem('currentMoviesUrl')) ||
      `${initialUrl}discover/movie?sort_by=popularity.desc&api_key=${appState.apiKey}&page=`,
    activeCategory: currentClassName || 'POPULAR'
  };

  const saveInLocalStorage = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetch":
        draft.results = action.value;
        return;
      case "selectedPage":
        draft.currentPage = action.value;
        saveInLocalStorage("pageNumber", action.value);
        return;
      case "POPULAR":
        draft.baseUrl = `${initialUrl}discover/movie?sort_by=popularity.desc&api_key=${appState.apiKey}&page=`;
        draft.total_pages = 500;
        draft.activeCategory = 'POPULAR';
        return;
      case "TOP-RATED":
        draft.baseUrl = `${initialUrl}movie/top_rated?api_key=${appState.apiKey}&language=en-US&page=`;
        draft.total_pages = 473;
        draft.activeCategory = 'TOP RATED';
        return;
      case "UPCOMING":
        draft.baseUrl = `${initialUrl}movie/upcoming?api_key=${appState.apiKey}&language=en-US&page=`;
        draft.total_pages = 11;
        draft.activeCategory = 'UPCOMING';
        return;
      case "NOW-PLAYING":
        draft.baseUrl = `${initialUrl}movie/now_playing?api_key=${appState.apiKey}&language=en-US&region=DE&page=`;
        draft.total_pages = 3;
        draft.activeCategory = 'NOW PLAYING';
        return;
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const getMovies = useCallback(async (selected) => {
    try {
      const response = await Axios.get(`${state.baseUrl}${selected}`);
      dispatch({ type: "fetch", value: response.data.results });
    } catch (e) {
      console.log("There was a problem fetching movies.");
      dispatch({ type: "fetch", value: null });
    }
  }, [state.baseUrl, dispatch]);

  const handlePaginationClick = useCallback((data) => {
    const selected = data.selected + 1;
    dispatch({ type: "selectedPage", value: selected });
    window.scrollTo(0, 0);
  }, [dispatch]);

  const allMovies = state.results?.map((movie) => (
    <MovieCard movie={movie} key={movie.id} pathname={location.pathname} />
  ));

  function handleCategoryClick(event, category) {
    event.preventDefault();
    dispatch({ type: category.replace(/\s/g, '-') });
    dispatch({ type: "selectedPage", value: 1 });
    saveInLocalStorage("currentClassName", category);
  }

  useEffect(() => {
    dispatch({ type: "fetch", value: null });
    getMovies(state.currentPage);
    saveInLocalStorage("totalPages", state.total_pages);
    saveInLocalStorage("currentMoviesUrl", state.baseUrl);
  }, [state.currentPage, state.total_pages, state.baseUrl, getMovies, dispatch]);

  const content = !state.results ? <LoadingCard /> : allMovies;

  return (
    <main id="home-user">
      <div className="nav-home-user">
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/"
                className={state.activeCategory === 'POPULAR' ? 'current' : ''}
                onClick={(e) => handleCategoryClick(e, 'POPULAR')}>
                Popular
              </Link>
            </li>
            <li>
              <Link to="#top-rated"
                className={state.activeCategory === 'TOP RATED' ? 'current' : ''}
                onClick={(e) => handleCategoryClick(e, 'TOP RATED')}>
                Top Rated
              </Link>
            </li>
            <li>
              <Link to="#upcoming"
                className={state.activeCategory === 'UPCOMING' ? 'current' : ''}
                onClick={(e) => handleCategoryClick(e, 'UPCOMING')}>
                Upcoming
              </Link>
            </li>
            <li>
              <Link to="#now-playing"
                className={state.activeCategory === 'NOW PLAYING' ? 'current' : ''}
                onClick={(e) => handleCategoryClick(e, 'NOW PLAYING')}>
                Now Playing
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <section>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={"Next"}
          breakClassName={'break-me'}
          pageCount={state.total_pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePaginationClick}
          containerClassName={`pagination ${appState.searchInput !== '' ? 'hide-pagination' : ''}`}
          forcePage={state.currentPage - 1}
          activeClassName={`active`}
          disableInitialCallback={true}
        />
        <div className="container-movie">
          {content}
        </div>
        <ReactPaginate
          breakClassName={'break-me'}
          pageCount={state.total_pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePaginationClick}
          containerClassName={`pagination ${appState.searchInput !== '' ? 'hide-pagination' : ''}`}
          activeClassName={`active`}
          forcePage={state.currentPage - 1}
        />
      </section>
    </main>
  );
}

export default HomeUser;
