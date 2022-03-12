import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import LoadingCard from "./loading/LoadingCard";
import MovieCard from "./MovieCard.js";

function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const [state, setState] = useImmer({
    latestMovies: null,
    popularMovies: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;


    const fetchData = async () => {
      try {
        const response = await Promise.all([Axios.get(
          `https://api.themoviedb.org/3/discover/movie?latest.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=1`
        ), Axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&page=1`
        )])

        if (active && response) setState((draft) => {
          draft.latestMovies = response[0].data.results;
          draft.popularMovies = response[1].data.results;
        });


      } catch (e) {
        console.log("There was a problem ");
        if (active) setState(draft => {
          draft.latestMovies = null;
          draft.popularMovies = null;
        });
      }
    }

    fetchData();

    return () => {
      active = false;
    };

  }, [setState, appDispatch]);

  const [latestMovies, popularMovies] = [
    state.latestMovies?.slice(0, 4)
      .map((movie, index) => <MovieCard movie={movie} key={index} />),
    state.popularMovies?.slice(4, 8)
      .map((movie, index) => <MovieCard movie={movie} key={index} />),
  ];

  return (
    <main id="home-guest">
      <section>
        <h1 className="section-title">
          <i className="far fa-star"></i> Latest Movies
        </h1>
        <div className="container-movie">{!state.popularMovies ? <LoadingCard /> : popularMovies}</div>
      </section>

      <section>
        <h1 className="section-title">
          <i className="far fa-star"></i> Popular Movies
        </h1>
        <div className="container-movie">{!state.latestMovies ? <LoadingCard /> : latestMovies}</div>
        <div id="section-content">
          <h2 className="heading-2  tc">Get an account today </h2>
          <p className="text-muted">
            Access free content on all of your devices, sync your list and
            continue watching anywhere.
          </p>
          <button className="register-btn" onClick={() => history.push("/register")}>
            Register Free
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomeGuest;
