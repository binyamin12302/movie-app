import { getDownloadURL } from "firebase/storage";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { Flip, toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useImmerReducer } from "use-immer";
import { auth, callRef } from "../src/firebase/Firebase";
// My Components  
import About from "./components/About";
import FilteredMovies from "./components/FilteredMovies";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import HomeUser from "./components/HomeUser";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Profile from './components/Profile';
import Register from "./components/Register";
import Terms from "./components/Terms";
import ViewSingleMovie from './components/ViewSingleMovie';
import DispatchContext from "./DispatchContext";
import "./scss/style.scss";
import StateContext from "./StateContext";


function App() {
  const customId = "custom-id-yes";
  let toastId = null;

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("userLoggedIn")),
    userUid: null,
    userProfile: null,
    filteredMovies: null,
    searchInput: ""
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
      case "notificationResult":
        notificationResult((action.value), (action.typeMessage), (action.transition));
        return;
      case "notificationLoading":
        loadingAuthentication();
        return;
      case "searchInput":
        draft.searchInput = action.value;
        return;
      case "setFilteredMovies":
        draft.filteredMovies = action.value;
        return;
      case "clearSerach":
        draft.searchInput = "";
        return;
      case "userProfile":
        draft.userProfile = action.value;
        return;
      default:
    }
  }

  function loadingAuthentication() {
    toast.loading("Please wait...", {
      toastId: customId,
      position: toast.POSITION.TOP_CENTER,
      transition: Zoom
    })
  }

  function notificationResult(value, message, transion, autoclose) {
    if (!toast.isActive(toastId)) {
      toastId = toast.update(customId, {
        render: value,
        toastId: customId,
        draggable: true,
        type: message,
        autoClose: 3000,
        transition: transion || Flip,
        isLoading: false,
      })
    }

    toast.error(value, {
      toastId: customId,
      position: toast.POSITION.TOP_CENTER,
      transition: Zoom
    });
  }

 



  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // detaching the listener
      if (user) {
        // ...your code to handle authenticated users.

        localStorage.setItem("userLoggedIn", state.loggedIn);
        dispatch({ type: "login", value: user.uid });
        dispatch({ type: "userProfile", value: user.photoURL });
        /* "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" */
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
    return () => unsubscribe(); // unsubscribing from the listener when the component is unmounting.

  }, [dispatch, state.loggedIn]);



  // useEffect(() => {
  //   let active = true;

  //   async function getImageProfile() {
  //     try {
  //       const url = await getDownloadURL(callRef(state.userUid))
  //       if (active) dispatch({ type: "userProfile", value: url });
  //     } catch (error) {
  //       if (active) dispatch({
  //         type: "userProfile", value: auth.currentUser?.photoURL
  //           || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  //       });
  //     }
  //   }

  //   if (state?.userUid) getImageProfile()

  //   return () => {
  //     active = false;
  //   };

  // }, [dispatch, state.userUid]);

  const homeContent = state.loggedIn ? HomeUser : HomeGuest;

  // console.log(auth?.currentUser)
  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
            <ToastContainer />
            <Header />
            <Switch>
              <Route exact path="/" component={state.searchInput === "" ? homeContent : FilteredMovies} />
              <Route path="/profile" component={state.searchInput === "" ? Profile : FilteredMovies} />
              {state.loggedIn ? <Redirect from="/login" to={"/"} /> || <Redirect from="/register" to={"/"} /> : null}
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route exact path="/movie/:id" component={state.searchInput === "" ? ViewSingleMovie : FilteredMovies} />
              <Route path="/about-us" component={About} />
              <Route path="/terms" component={Terms} />
            </Switch>
            <Footer />
          </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
