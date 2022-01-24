import Axios from "axios";
import { debounce } from "lodash";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";
import LoadingCard from "./LoadingCard.js";
import LoadingPage from "./LoadingPage.js";
import MovieCard from "./MovieCard.js";

function HomeUser(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const currentClassName = JSON.parse(localStorage.getItem('currentClassName'));

  


  const initialState = {
    results: [],
    total_pages: JSON.parse(localStorage.getItem('totalPages')) || 500,
    currentPage: JSON.parse(localStorage.getItem('pageNumber')) || 1,
    baseUrl: JSON.parse(localStorage.getItem('currentMoviesUrl')) ||
      `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=`
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.results = action.value
        return;
      case "selectedPage":
        draft.currentPage = action.value
        saveInLocalStorage("pageNumber", action.value)
        return;
      case "POPULAR":
        draft.baseUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=`
        draft.total_pages = 500
        return;
      case "TOP-RATED":
        draft.baseUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&page=`
        draft.total_pages = 473
        return;
      case "UPCOMING":
        draft.baseUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&page=`
        draft.total_pages = 11
        return;
      case "NOW-PLAYING":
        draft.baseUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&region=DE&page=`
        draft.total_pages = 3
        return;
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const getMovies = useMemo(
    () =>
      debounce(async function (selected) {
        try {
          const response = await Axios.get(`${state.baseUrl + selected}`);
          dispatch({ type: "fetchComplete", value: response.data.results })
          appDispatch({ type: "loadingCard", value: false })
        } catch (e) {
          console.log("There was a problem ww.");
        }
      }, 200)
    , [appDispatch, state.baseUrl, dispatch]);


  const handlePaginationClick = useCallback(
    data => {
      let selected = data.selected
      selected ? selected++ : selected = 1
      dispatch({ type: "selectedPage", value: selected })
      window.scrollTo(0, 0)
    },
    [dispatch]
  );

  const allMovies = state.results.map((movie, index) => {
    return <MovieCard movie={movie} key={index} pathname={props.location.pathname} />;
  })

  function handleCurrentPage(event) {
    handleClassName(event)
    dispatch({ type: "selectedPage", value: 1 })
    dispatch({ type: `${event.target.innerText.replace(/\s/g, '-')}` })
  }

  useEffect(() => {
    appDispatch({ type: "loadingCard", value: true })
    getMovies(state.currentPage)
    saveInLocalStorage("totalPages", state.total_pages)
    saveInLocalStorage("currentMoviesUrl", state.baseUrl)
  }, [state.currentPage, state.total_pages, state.baseUrl, getMovies, appDispatch])


  function handleClassName(event) {
    let allCurrentClassName = Array.from(document.getElementsByClassName('current'))

    allCurrentClassName.forEach(element => {
      element.classList.remove('current')
    });

    if (event) {
      event.target.classList.add('current')
    }

    saveInLocalStorage("currentClassName", event.target.innerText)
  }

  function saveInLocalStorage(name, value) {
    localStorage.setItem(`${name}`, JSON.stringify(value));
  }

  const content = appState.loadingCard ? <LoadingCard /> : allMovies

  return (
    <main id="home-user">
      <div className="nav-home-user" >
        <nav className="main-nav">
          <ul>
            <li><Link to="/" className={!currentClassName || currentClassName === 'POPULAR' ? 'current' : ''} onClick={handleCurrentPage}>Popular</Link></li>
            <li><Link to="#top-rated" className={currentClassName === 'TOP RATED' ? 'current' : ''} onClick={handleCurrentPage}>Top Rated</Link></li>
            <li><Link to="#upcoming" className={currentClassName === 'UPCOMING' ? 'current' : ''} onClick={handleCurrentPage}>Upcoming</Link></li>
            <li><Link to="#now-playing" className={currentClassName === 'NOW PLAYING' ? 'current' : ''} onClick={handleCurrentPage}>Now Playing</Link></li>
          </ul>
        </nav>
      </div>
      <section >
        {
          appState.loadingPage ? <LoadingPage /> :
            <>
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={"Next"}
                breakClassName={'break-me'}
                pageCount={state.total_pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePaginationClick}
                containerClassName={`pagination ${appState.searchInput !== '' && 'hide-pagination'}`}
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
                containerClassName={`pagination ${appState.searchInput !== '' && 'hide-pagination'}`}
                activeClassName={`active`}
                forcePage={state.currentPage - 1}
              />
            </>
        }
      </section>
    </main>
  );
}

export default HomeUser;
