import Axios from "axios";
import { debounce } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [searchInput, setSearchInput] = useState("");

  const searchMovie = useMemo(
    () =>
      debounce(async function (e) {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&query="${e}"`);
          appDispatch({ type: "setFilteredMovies", value: response.data.results })
          appDispatch({ type: "loadingPage", value: false })
          console.log(response.data.results)
        } catch (error) {
          console.log("There was a problem.");
        }
      }, 750),
    [appDispatch]
  );


  const handleInputChange = useCallback(
    e => {
      setSearchInput(e.target.value);
      appDispatch({ type: "searchInput", value: e.target.value })
      appDispatch({ type: "loadingPage", value: true })
      searchMovie(e.target.value)
    },

    [appDispatch, searchMovie]
  );

  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />

  return (
    <>
      <header>
        <div id="header">
          <div className="container">
            <h2 className="logo-header">MoiveApp</h2>
            {appState.loggedIn &&
              <input type="text" onChange={handleInputChange} value={searchInput} id="search" className="search" placeholder="Search" />
            }
            <div id="navigation">
              <button className="home-btn" type="button">
                <Link to="/" className="home-link">
                  Home
                </Link>
              </button>
              {headerContent}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}



export default Header;
