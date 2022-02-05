import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";
import LoadingCard from "./loadingPages/LoadingCard";
import MovieCard from "./MovieCard.js";

function HomeGuest() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    latestMovies: [],
    popularMovies: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    appDispatch({ type: "loadingPage", value: true })

    async function fetchData() {
      try {

        const response = await Promise.all([Axios.get(
          `https://api.themoviedb.org/3/discover/movie?latest.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=1`
        ), Axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&page=1`
        )])
        // JavaScript will wait until ALL of the promises have completed

        setState((draft) => {
          draft.latestMovies = response[0].data.results;
          draft.popularMovies = response[1].data.results;
        });

        appDispatch({ type: "loadingPage", value: false })

      } catch (e) {
        console.log("There was a problem ");
      }
    }
    fetchData();

  }, [setState, appDispatch]);

  const [latestMovies, popularMovies] = [
    state.latestMovies
      .slice(0, 4)
      .map((movie, index) => <MovieCard movie={movie} key={index} />),
    state.popularMovies
      .slice(4, 8)
      .map((movie, index) => <MovieCard movie={movie} key={index} />),
  ];

  return (
    <main id="home-guest">
      <section>
        <h1 className="section-title">
          <i className="far fa-star"></i> Latest Movies
        </h1>
        <div className="container-movie">{appState.loadingPage ? <LoadingCard /> : popularMovies}</div>
      </section>

      <section>
        <h1 className="section-title">
          <i className="far fa-star"></i> Popular Movies
        </h1>
        <div className="container-movie">{appState.loadingPage ? <LoadingCard /> : latestMovies}</div>
        <div id="section-content">
          <h2 className="heading-2  tc">Get an account today </h2>
          <p className="text-muted">
            Access free content on all of your devices, sync your list and
            continue watching anywhere.
          </p>
          <Link className="link" to="/register">
            <button className="register-btn" type="submit">
              Register Free
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomeGuest;
