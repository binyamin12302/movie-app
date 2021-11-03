import React from "react";
import './HomeGuest.css';
import Axios from "axios";
import { useEffect } from "react";
import Movie from "../movie-card/Movie";
import { useImmer } from "use-immer";
import Loading from "../loading/Loading";
import { Link } from "react-router-dom";

function HomeGuest() {

    const [state, setState] = useImmer({
        latestMovies: [],
        popularMovies: [],
        isLoading: true
    })


    useEffect(() => {

        window.scrollTo(0, 0)

        async function fetchData() {
            try {
                const responseLatestApi = await Axios.get(`https://api.themoviedb.org/3/discover/movie?latest.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=1`);
                const responsePopularApi = await Axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&language=en-US&page=1`);
                setState(draft => {
                    draft.latestMovies = responseLatestApi.data.results;
                    draft.popularMovies = responsePopularApi.data.results;
                })

                setState(draft => {
                    draft.isLoading = false;
                })

            } catch (e) {
                console.log("There was a problem ");
            }
        }
        fetchData()
    }, [setState])

    const latestMovies = state.latestMovies.slice(0, 4).map((movie, index) => <Movie movie={movie} key={index} />)
    const popularMovies = state.popularMovies.slice(4, 8).map((movie, index) => <Movie movie={movie} key={index} />)

    return (
        <>
            {state.isLoading ? <Loading /> :
                <main>
                    <section className='home-guest'>
                        <h1 className="section-title"><i className="far fa-star"></i> Latest Movies</h1>
                        <div className="movies">
                            {popularMovies}
                        </div>
                    </section>

                    <section className='home-guest'>
                        <h1 className="section-title"><i className="far fa-star"></i> Popular Movies</h1>
                        <div className="movies">
                            {latestMovies}
                        </div>

                        <div className='section-content'>
                            <h2 className="text-header">Get an account today </h2>
                            <p className="text-muted">Access free content on all of your devices, sync your list and continue watching anywhere. </p>
                            <Link className='link' to='/register'>
                                <button className="register-btn" type="submit">Register Free</button>
                            </Link>
                        </div>
                    </section>
                </main>
            }
        </>
    )
}

export default HomeGuest;