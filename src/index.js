import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useImmerReducer } from "use-immer";
import ScrollToTop from 'react-router-scroll-top';
import { auth } from "../src/firebase/Firebase";
// My Components  
import About from "./components/About";
import FilteredMovies from "./components/FilteredMovies";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import HomeUser from "./components/HomeUser";
import Login from "./components/Login";
import NotFoundPage from "./components/NotFoundPage";
import Profile from './components/Profile';
import Register from "./components/Register";
import Terms from "./components/Terms";
import ViewSingleMovie from './components/ViewSingleMovie';
import DispatchContext from "./DispatchContext";
import "./scss/style.scss";
import StateContext from "./StateContext";


function App() {
  const customId = "custom-id-yes";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initialState = {
    apiKey: process.env?.REACT_APP_THEMOVIEDB_API_KEY,
    loggedIn: Boolean(localStorage.getItem("userLoggedIn")),
    userUid: null,
    userProfile: null,
    filteredMovies: null,
    searchInput: "",
    notification,
    notificationLoading
  };

  /*  https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png */

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.userUid = action.value
        return;
      case "logout":
        draft.loggedIn = false;
        draft.userUid = null;
        draft.userProfile = null;
        return;
      case "searchInput":
        draft.searchInput = action.value;
        return;
      case "setFilteredMovies":
        draft.filteredMovies = action.value;
        return;
      case "clearSearch":
        draft.searchInput = "";
        return;
      case "userProfile":
        draft.userProfile = action.value;
        return;
      default:
    }
  }


  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  function notificationLoading() {
    toast.loading("Please wait...", {
      toastId: customId,
      position: toast.POSITION.TOP_CENTER,
      transition: Zoom
    })
  }

  function notification(value, message, transition, autoclose) {
    toast(value, {
      toastId: customId,
      position: toast.POSITION.TOP_CENTER,
      type: message,
      autoClose: 2000,
      transition: transition || Zoom,
      isLoading: false
    });

    if (toast.isActive(customId))
      toast.update(customId, {
        render: value,
        toastId: customId,
        draggable: true,
        type: message,
        transition: transition || Zoom,
        autoClose: 2000,
        isLoading: false,
      })

  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {

      if (user) {
        localStorage.setItem("userLoggedIn", state.loggedIn);
        dispatch({ type: "login", value: user.uid });
        dispatch({
          type: "userProfile",
          value: user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
        });

        // "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
      } else {
        // No user is signed in...code to handle unauthenticated users.
        console.log("sorry");
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem('pageNumber');
        localStorage.removeItem('currentMoviesUrl');
        localStorage.removeItem('currentClassName');
        localStorage.removeItem('profileComment');
        dispatch({ type: "logout" });
      }
    });
    return () => unsubscribe();

  }, [dispatch, state.loggedIn]);


  const isUserSearchingForMovies = state.searchInput === "" ? HomeUser : FilteredMovies
  const homeContent = state.loggedIn ? isUserSearchingForMovies : HomeGuest;

  const login = !state.loggedIn ?
    <Route path="/login" component={Login} /> : <Redirect from="/login" to={"/"} />;

  const register = !state.loggedIn ?
    <Route path="/register" component={Register} /> : <Redirect from="/register" to={"/"} />;

  const viewSingleMovie = state.loggedIn ?
    <Route exact path="/movie/:id" component={state.searchInput === "" ? ViewSingleMovie : FilteredMovies} /> :
    <Redirect from="/movie/:id" to={"/"} />;

  const profile = state.loggedIn ?
    <Route path="/profile" component={state.searchInput === "" ? Profile : FilteredMovies} /> :
    <Redirect from="/profile" to={"/"} />;

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
            <ToastContainer />
            <Header />
            <ScrollToTop />
            <Switch>
              <Route exact path="/" component={homeContent} />
              {profile}
              {register}
              {login}
              {viewSingleMovie}
              <Route path="/about-us" component={About} />
              <Route path="/terms" component={Terms} />
              <Route component={NotFoundPage} />
            </Switch>
            <Footer />
          </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
