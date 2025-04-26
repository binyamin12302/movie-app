import Axios from "axios";
import React, { useContext, useEffect } from 'react';
import Iframe from 'react-iframe';
import { useHistory, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import StateContext from "../StateContext";
import Comments from "./Comments.js";
import LoadingSingleMovie from "./loading/LoadingSingleMoviePage";
import MovieCard from "./MovieCard";
import NotFound from "./NotFound.js";

function ViewSingleMovie(props) {
    const { id } = useParams();
    const history = useHistory();
    const appState = useContext(StateContext);

    const initialUrl = `https://api.themoviedb.org/3/movie/`;
    const movieCardUrl = `${initialUrl}${id}?api_key=${appState.apiKey}&language=en-US`;
    const videoUrl = `${initialUrl}${id}/videos?api_key=${appState.apiKey}&language=en-US`;
    const creditsUrl = `${initialUrl}${id}/credits?api_key=${appState.apiKey}&language=en-US`;
    const similarMoviesUrl = `${initialUrl}${id}/similar?api_key=${appState.apiKey}&language=en-US&page=1`;

    const [state, setState] = useImmer({
        movieData: null,
        hasError: false,
        videoKey: "",
        cast: null,
        genres: null,
        similar: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState(draft => {
                    draft.movieData = null; 
                    draft.cast = null;
                    draft.genres = null;
                    draft.similar = null;
                    draft.videoKey = "";
                    draft.hasError = false;
                });

                const response = await Promise.all([
                    Axios.get(movieCardUrl),
                    Axios.get(videoUrl),
                    Axios.get(creditsUrl),
                    Axios.get(similarMoviesUrl)
                ]);

                const findTrailerMovie = response[1].data.results.find(
                    i => i.name.toLowerCase().includes("trailer")
                );

                setState(draft => {
                    draft.movieData = response[0].data;
                    draft.cast = response[2].data.cast;
                    draft.genres = response[0].data.genres;
                    draft.similar = response[3].data.results;
                    draft.videoKey = findTrailerMovie?.key || "";
                    draft.hasError = false;
                });
            } catch (e) {
                console.log("There was a problem fetching movie data.");
                setState(draft => {
                    draft.hasError = true;
                });
            }
        };

        fetchData();
    }, [id, movieCardUrl, videoUrl, creditsUrl, similarMoviesUrl, setState]);

    if (state.hasError) {
        return <NotFound />;
    }

    function handleClickSimilarMovie(newId) {
        if (window.location.pathname === `/movie/${newId}`) return;
        history.push(`/movie/${newId}`);
    }

    const similar = state.similar?.slice(0, 4).map((movie) => (
        <div className="card-container" key={movie.id} onClick={() => handleClickSimilarMovie(movie.id)}>
            <img className="cardImage similar" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
        </div>
    ));

    const cast = state.cast?.slice(0, 4).map((actor) => (
        <div className="card-container" key={actor.id}>
            {actor.profile_path === null ? (
                <img className="cardImag not-available-image" src={"http://www.pardes.co.il/pics/contrib764.jpg"} alt="Avatar" />
            ) : (
                <img className="cardImage cast" src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`} alt={actor.name} />
            )}
            <div className="overlay">{actor.name}</div>
        </div>
    ));

    const genres = state.genres?.map((genre) => (
        <h6 className="genre" key={genre.id}>{genre.name}</h6>
    ));

    return (
        <>
            {!state.cast || !state.genres || !state.similar ? (
                <LoadingSingleMovie />
            ) : (
                <div id="single-movie">
                    <div className="content">
                        <div className="column-one container-movie">
                            <MovieCard movie={state?.movieData} pathname={props.match.path} />
                        </div>
                        <div className="column-two">
                            <div className="ove">
                                <h2 className="heading-2">Overview</h2>
                                <p className="text">
                                    {state.movieData?.overview === ""
                                        ? 'There is no overview for this movie yet.'
                                        : state.movieData?.overview}
                                </p>
                                <div className="row ge">
                                    {genres}
                                </div>
                            </div>

                            <h2 className="heading-2">Video</h2>
                            <Iframe
                                url={`https://www.youtube-nocookie.com/embed/${state.videoKey}`}
                                className="video"
                                allow="fullscreen"
                            />
                        </div>

                        <div className="column-three">
                            <div>
                                <h2 className="heading-2">Photos acteurs</h2>
                                <div className="row">
                                    {cast}
                                </div>
                            </div>
                            <hr />
                            {similar?.length !== 0 && (
                                <div className="sim">
                                    <h2 className="heading-2">Similar Movies</h2>
                                    <div className="row">
                                        {similar}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <Comments id={id} />
                </div>
            )}
        </>
    );
}

export default ViewSingleMovie;
