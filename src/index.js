import { getDownloadURL } from "firebase/storage";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
    user: {
      uid: "",
      name: "",
      email: "",
      profileImage: ""
    },
    loadingPage: false,
    filteredMovies: [],
    searchInput: ""
  };

  /*  https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png */

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user.uid = action.uid;
        draft.user.name = action.name;
        draft.user.email = action.email;
        return;
      case "logout":
        draft.loggedIn = false;
        draft.user = {
          uid: "",
          name: "",
          email: "",
          profileImage: ""
        }
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
      case "loadingPage":
        draft.loadingPage = action.value;
        return;
      case "clearSerach":
        draft.searchInput = "";
        return;
      case "changeProfileImage":
        draft.user.profileImage = action.value;
        return;
      default:
    }
  }


  function notificationResult(value, message, transion, autoclose) {
    if (!toast.isActive(toastId)) {
      toastId = toast.update(customId, {
        render: value,
        position: toast.POSITION.TOP_CENTER,
        toastId: customId,
        draggable: true,
        type: message,
        autoClose: autoclose || 3000,
        transition: transion || Flip,
        isLoading: false,
      })
    }
  }

  function loadingAuthentication() {
    toast.loading("Please wait...", {
      toastId: customId,
      position: toast.POSITION.TOP_CENTER,
      transition: Zoom
    })
  }


  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // detaching the listener
      if (user) {
        // ...your code to handle authenticated users.

        localStorage.setItem("userLoggedIn", state.loggedIn);
        dispatch({ type: "login", uid: user.uid, name: user.displayName, email: user.email });

        /* "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" */
        /*  dispatch({ type: "changeProfileImage", value: user.photoURL }); */
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

  }, [dispatch, state.loggedIn, state.guestSessionId, state.user.profileImage]);
  ;



  useEffect(() => {

    if (state.loggedIn && state.user.uid) {
      getImageProfile()
    }
    
    async function getImageProfile() {
      try {
        const url = await getDownloadURL(callRef(state.user.uid))
        dispatch({ type: "changeProfileImage", value: url });
      } catch (error) {
        console.log(error)
        dispatch({ type: "changeProfileImage", value: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" });
      }
    }

  }, [dispatch, state.user.uid, state.loggedIn]);

  const homeContent = state.loggedIn ? HomeUser : HomeGuest;

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
            <ToastContainer />
            <Header />
            <Switch>
              <Route exact path="/" component={state.searchInput === "" ? homeContent : FilteredMovies} />
              <Route path="/login" component={Login} />
              <Route path="/about-us" component={About} />
              <Route path="/terms" component={Terms} />
              <Route path="/register" component={Register} />
              <Route path="/profile" component={Profile} />
              <Route path="/movie/:id" component={state.searchInput === "" ? ViewSingleMovie : FilteredMovies} />
            </Switch>
            <Footer />
          </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  );
}



ReactDOM.render(<App />, document.getElementById("root"));
