import { signOut } from "@firebase/auth";
import Axios from "axios";
import { debounce } from "lodash";
import { React, useCallback, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';
import DispatchContext from "../DispatchContext.js";
import { auth } from "../firebase/Firebase";
import StateContext from "../StateContext";


function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const history = useHistory();

  const logout = async () => {
    appState.notificationLoading();
    history.push('/')
    await signOut(auth);
    appState.notification("You have successfully logged out.", `${toast.TYPE.SUCCESS}`, Bounce)
  }

  const searchMovie = useMemo(
    () =>
      debounce(async (e) => {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&query="${e}"`);
          appDispatch({ type: "setFilteredMovies", value: response.data.results });
        } catch (error) {
          console.log("There was a problem.");
          appDispatch({ type: "setFilteredMovies", value: null });
        }
      }, 750),
    [appDispatch]
  );


  const handleInputChange = useCallback(
    e => {
      appDispatch({ type: "setFilteredMovies", value: null });
      appDispatch({ type: "searchInput", value: e.target.value })
      searchMovie(e.target.value)
    },
    [appDispatch, searchMovie]);


  return (
    <>
      <input
        type="text"
        onChange={handleInputChange}
        value={appState.searchInput}
        id="search"
        className="search"
        placeholder="Search"
      />
      <div>
        {appState.userProfile ?
          <img
            src={appState.userProfile}
            alt='Avatar'
            className='avatar'
            onClick={() => history.push("/profile")}
          /> :
          <div className="avatar profile-image-loading"></div>
        }
        <button className="home-btn" onClick={() => {
          history.push("/")
          appDispatch({ type: "clearSerach" })
        }}>
          Home
        </button>
        <button className="logout-btn" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
