import Axios from "axios";
import React, { useContext, useEffect } from 'react';
import Iframe from 'react-iframe';
import { useHistory, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import Comments from "./Comments.js";
import LoadingSingleMovie from "./loading/LoadingSingleMoviePage";
import MovieCard from "./MovieCard";
import NotFound from "./NotFound.js";

function ViewSingleMovie(props) {
    const { id } = useParams();
    const history = useHistory();
    const appDispatch = useContext(DispatchContext);
    /* const appState = useContext(StateContext); */

    const [state, setState] = useImmer({
        movieData: null,
        hasError: false,
        videoKey: "",
        cast: null,
        genres: null,
        similar: null
    })


    useEffect(() => {
        let active = true;
        async function fetchData() {

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
            } catch (e) {
                console.log("There was a problem ");
                setState(draft => {
                    draft.hasError = true
                });
            }
        }

        if (active) {
            fetchData();
        }




        return () => {
            active = false;
        };
    }, [id, setState, appDispatch, state.hasError])


    if (state.hasError) {
        return <NotFound />
    }


    function handleClickSimilarMovie(id) {
        if (window.location.pathname === `/movie/${id}`) return null

        history.push(`/movie/${id}`)

        setState(draft => {
            draft.cast = null
            draft.genres = null
            draft.similar = null
        });

    }


    const [similar, cast, genres] = [state.similar?.slice(0, 4)
        .map((movie, i) =>
            <div className="card-container" key={i} onClick={() => handleClickSimilarMovie(movie.id)}>
                <img className="cardImage similar" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="Avatar" />
                {/*   <div className="overlay">{movie.title}</div>  */}
            </div>
        ),
    state.cast?.slice(0, 4).map((actor, i) =>
        <div className="card-container" key={i}>
            {actor.profile_path === null ? <img className="not-available-image" src={"http://www.pardes.co.il/pics/contrib764.jpg"} alt="Avatar" /> :
                <img className="cardImage cast" src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`} alt={actor.name} />}
            <div className="overlay">{actor.name}</div>
        </div>
    ), state.genres?.map((genre) => <h6 className="genre" key={genre.id} >{genre.name}</h6>)
    ]

    return (
        <>
            {!state.cast || !state.genres || !state.similar ? <LoadingSingleMovie /> :
                <>
                    <div id="single-movie" >

                        <div className="content">
                            <div className="column-one  container-movie">
                                <MovieCard  movie={state?.movieData} pathname={props.match.path} />
                            </div>
                            <div className="column-two">

                                <h2 className="heading-2" >Overview</h2>
                                <p className="text">{state.movieData?.overview === "" ?
                                    'There is no overview for this movie yet.'
                                    : state.movieData?.overview}</p>
                                <div className="row ge">
                                    {genres}
                                </div>

                                <h2 className="heading-2" >Video</h2>
                                <Iframe
                                    url={`https://www.youtube-nocookie.com/embed/${state.videoKey}`}
                                    className="video"
                                    allow="fullscreen" />
                            </div>
                            <div className="column-three" >
                                <h2 className="heading-2" >Photos acteurs</h2>
                                <div className="row">
                                    {cast}
                                </div>
                                <hr />
                                <div className="sim">
                                    <h2 className="heading-2">Similar Movies</h2>
                                    <div className="row ">
                                        {similar}
                                    </div>
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
