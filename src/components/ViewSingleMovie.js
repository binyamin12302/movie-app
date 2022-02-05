import Axios from "axios";
import React, { useContext, useEffect } from 'react';
import Iframe from 'react-iframe';
import { useHistory, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import image from "../image/image-not-found.png";
import StateContext from "../StateContext";
import Comments from "./Comments.js";
import LoadingSingleMovie from "./loadingPages/LoadingSingleMovie";
import MovieCard from "./MovieCard";
import NotFound from "./NotFound.js";

function ViewSingleMovie(props) {
    const { id } = useParams();
    const history = useHistory();
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        movieData: {},
        hasError: false,
        videoKey: "",
        cast: [],
        genres: [],
        similar: []
    })


    useEffect(() => {

        async function fetchData() {
            appDispatch({ type: "loadingPage", value: true })
            try {
                const response = await Promise.all([Axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US`
                ), Axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language&language=en-US`
                ), Axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language&language=en-US`
                ),
                Axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language&language&language=en-US&page=1`
                )
                ])

                setState(draft => {
                    draft.movieData = response[0].data
                    draft.date = response[0].data.release_date
                    draft.hasError = false
                    draft.cast = response[2].data.cast
                    draft.genres = response[0].data.genres
                    draft.similar = response[3].data.results
                });


                if (response[1].data.results.length === 0) {
                    setState(draft => {
                        draft.videoKey = ""
                    });
                } else {
                    setState(draft => {
                        draft.videoKey = response[1].data.results[0].key
                    });
                }

                appDispatch({ type: "loadingPage", value: false })

            } catch (e) {
                console.log("There was a problem ");
                setState(draft => {
                    draft.hasError = true
                });
            }
        }

        fetchData();

    }, [id, setState, appDispatch, state.hasError])


    if (state.hasError) {
        return <NotFound />
    }


    function handleClickSimilarMovie(id) {
        history.push(`/movie/${id}`)
    }


    const [similar, cast, genres] = [state.similar
        .slice(0, 4)
        .map((movie, i) =>
            <div className="card-container" key={i} onClick={() => handleClickSimilarMovie(movie.id)}>
                <img className="cardImage similar" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="Avatar" />
                {/*  <div className="overlay">{movie.title}</div> */}
            </div>
        ),
    state.cast
        .slice(0, 4)
        .map((actor, i) =>
            <div className="card-container" key={i}>
                {actor.profile_path === null ? <img className="not-available-image" src={image} alt="Avatar" /> :
                    <img className="cardImage cast" src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`} alt={actor.name} />}
                <div className="overlay">{actor.name}</div>
            </div>
        ), state.genres.map((genre) => <h6 className="genre" key={genre.id} >{genre.name}</h6>)
    ]

    return (
        <>
            {appState.loadingPage ? <LoadingSingleMovie /> :
                <>
                    <div id="single-movie" >
                        <div className="content">
                            <div className="container-movie">
                                <MovieCard movie={state.movieData} pathname={props.match.path} />
                            </div>
                            <div className="column-two">
                                <h2 className="heading-2" >Overview</h2>
                                <p className="text">{state.movieData.overview === "" ?
                                    'There is no overview for this movie yet.'
                                    : state.movieData.overview}</p>
                                <div className="row">
                                    {genres}
                                </div>

                                <h2 className="heading-2" >Video</h2>
                                <Iframe url={`https://www.youtube-nocookie.com/embed/${state.videoKey}`}
                                    className="video"
                                    display="initial"
                                    allow="fullscreen" />
                            </div>

                            <div className="column-three" >
                                <h2 className="heading-2" >Photos acteurs</h2>
                                <div className="row">
                                    {cast}
                                </div>
                                <hr />
                                <h2 className="heading-2" >Similar Movies</h2>
                                <div className="row">
                                    {similar}
                                </div>
                            </div>
                        </div>
                        <Comments id={id} />
                    </div>
                </>}
        </>
    )
}

export default ViewSingleMovie;
