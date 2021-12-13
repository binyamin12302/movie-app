import Axios from "axios";
import { debounce } from "lodash";
import React, { useContext, useMemo, useCallback } from "react";
import ReactPaginate from 'react-paginate';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";
import Movie from "./Movie.js";
import LoadingPage from './LoadingPage';
import NotFound from "./NotFound.js";
import { Link } from "react-router-dom";


function HomeUser() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    page: JSON.parse(localStorage.getItem('pageNumber')) || 1,
    results: [],
    total_pages: 500
  })

  const getMovies = useMemo(
    () =>
      debounce(async function (selected) {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=${selected}`);
          setState(draft => {
            draft.results = response.data.results
          })
          appDispatch({ type: "loadingPage", value: false })
        } catch (e) {
          console.log("There was a problem ww.");
        }
      }, 750),
    [appDispatch, setState]
  );


  const handlePageClick = useCallback(
    data => {
      let selected = data.selected
      selected ? selected++ : selected = 1
      appDispatch({ type: "loadingPage", value: true })
      getMovies(selected);
      saveInLocalStorage(selected)
      window.scrollTo(0, 0)
    },
    [getMovies, appDispatch]
  );


  function saveInLocalStorage(selected) {
    localStorage.setItem("pageNumber", JSON.stringify(selected));
  }


  const allMovies = state.results.map((movie, index) => {
    return <Movie movie={movie} key={index} />;
  })

  const filteredMovies = appState.filteredMovies.map((movie, index) => {
    return <Movie movie={movie} key={index} />;
  })


  const dn = appState.filteredMovies.length === 0 && appState.searchInput !== "" ? <NotFound /> : filteredMovies;

  const content = appState.searchInput === "" ? allMovies : dn;

  return (
    <>

      <main id="home-guest">

        <div id="nav-home-user" >
          <nav id="main-nav">
            <ul>
              <li><Link to="/" className="current">Popular Movies</Link></li>
              <li><Link to="#about-a">Latest Movies</Link></li>
              <li><Link to="#work-a">Work</Link></li>
              <li><Link to="#contact-a">Contact</Link></li>
            </ul>
          </nav>
        </div>



        <section id="home-user" >
          <div className="movies  user-movies">
            {appState.loadingPage ? <LoadingPage /> : content}
          </div>
        </section>

        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={state.total_pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={`pagination ${appState.searchInput !== '' && 'hide-pagination'}`}
          activeClassName={`active`}
          initialPage={state.page - 1}
          pageClassName={'link'}
        />

      </main>

    </>
  );
}

export default HomeUser;
