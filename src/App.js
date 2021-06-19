import Axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Movie from "./Movie";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { debounce } from "lodash";
import "./App.css";

function App() {
  const [movies, setMovies] = useState({
    page: 1,
    results: [],
    total_pages: 500
  });

  const [searchInput, setSearchInput] = useState("");
  const [filteredmovies, setFilteredmovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=${movies.page}`);
        setMovies(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem.");
      }
    }
    fetchData();
  }, [movies.page]);

  const handler = useMemo(
    () =>
      debounce(async function (e) {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&query="${e}"`);
          setFilteredmovies(response.data.results);
          setIsLoading(false);
          if (response.data.results.length === 0) {
            setIsMovieFound(false);
          }
        } catch (error) {
          console.log("There was a problem.");
        }
      }, 750),
    []
  );

  const handleInputChange = useCallback(
    e => {
      setSearchInput(e.target.value);
      handler(e.target.value);
      setIsLoading(true);
      setIsMovieFound(true);
    },
    [handler]
  );

  function handleNextAndPreviousClick(e) {
    setMovies(prevstate => {
      return { ...prevstate, page: e.target.innerText === "»" ? prevstate.page + 1 : prevstate.page - 1 };
    });
  }

  function handlePageMovie(e) {
    const numberPage = parseInt(e.target.innerText);
    setMovies(prevstate => {
      return { ...prevstate, page: numberPage };
    });
  }

  const allMovies = isLoading ? (
    <Loading />
  ) : (
    movies.results.map((movie, index) => {
      return <Movie isLoading={isLoading} movie={movie} key={index} />;
    })
  );

  const allfilteredmovies = isLoading ? (
    <Loading />
  ) : (
    filteredmovies.map((movie, index) => {
      return <Movie isLoading={isLoading} movie={movie} key={index} />;
    })
  );

  const isFoundfilteredmovies = isMovieFound ? allfilteredmovies : <NotFound />;

  const content = searchInput === "" ? allMovies : isFoundfilteredmovies;

  return (
    <div>
      <header>
        <h1 className="headerText">MoiveApp</h1>
        <form onSubmit={e => e.preventDefault()} id="form">
          <input onChange={handleInputChange} type="text" value={searchInput} id="search" className="search" placeholder="Search" />
        </form>
      </header>
      {searchInput === "" && (
        <div className="navigation page">
          <ul className="pagination">
            {movies.page > 1 ? <li onClick={handleNextAndPreviousClick}>&laquo;</li> : null}
            <li className="active">{movies.page}</li>
            {movies.page <= 499 && <li onClick={e => handlePageMovie(e)}>{movies.page + 1}</li>}
            {movies.page <= 498 && <li onClick={e => handlePageMovie(e)}>{movies.page + 2}</li>}
            {movies.page <= 497 && <li onClick={e => handlePageMovie(e)}>{movies.page + 3}</li>}
            {movies.page <= 496 && <li onClick={e => handlePageMovie(e)}>{movies.page + 4}</li>}
            {movies.page <= 495 && <li onClick={e => handlePageMovie(e)}>{movies.page + 5}</li>}
            {movies.page < 495 ? <li onClick={handleNextAndPreviousClick}>&raquo;</li> : null}
          </ul>
        </div>
      )}
      <main id="main">{content}</main>
    </div>
  );
}

export default App;
