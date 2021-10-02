import Axios from "axios";
import { useState, useCallback, useMemo } from "react";
import Movie from "./Movie";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { debounce } from "lodash";
import "./css/Style.css";
import "./css/Mobile.css";
import ReactPaginate from 'react-paginate';

function App() {
  const [movies, setMovies] = useState({
    page: JSON.parse(localStorage.getItem('pageNumber')) || 1,
    results: [],
    total_pages: 500
  });

  const [searchInput, setSearchInput] = useState("");
  const [filteredmovies, setFilteredmovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMovieFoundAfterSearch, setIsMovieFoundAfterSearch] = useState(false);

  const getMovies = useMemo(
    () =>
      debounce(async function (selected) {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=${selected}`);
          setMovies(response.data);
          setIsLoading(false);
        } catch (e) {
          console.log("There was a problem ww.");
        }
      }, 750),
    []
  );

  const searchMovie = useMemo(
    () =>
      debounce(async function (e) {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&query="${e}"`);
          setFilteredmovies(response.data.results);
          setIsLoading(false);
          if (response.data.results.length === 0) {
            setIsMovieFoundAfterSearch(false);
          }
        } catch (error) {
          console.log("There was a problem.");
        }
      }, 750),
    []
  );


  
  const handlePageClick = useCallback(
    data => {
      let selected = data.selected

      selected ? selected++ : selected = 1

      setIsLoading(true);
      getMovies(selected);
      saveInLocalStorage(selected)
    },
    [getMovies]
  );


  const handleInputChange = useCallback(
    e => {
      setSearchInput(e.target.value);
      searchMovie(e.target.value);
      setIsLoading(true);
      setIsMovieFoundAfterSearch(true);
    },
    [searchMovie]
  );


  function saveInLocalStorage(selected) {
    localStorage.setItem("pageNumber", JSON.stringify(selected));
  }


  const allMovies = movies.results.map((movie, index) => {
    return <Movie isLoading={isLoading} movie={movie} key={index} />;
  })

  const allfilteredmovies = filteredmovies.map((movie, index) => {
    return <Movie isLoading={isLoading} movie={movie} key={index} />;
  })

  const areFilteredMoviesFound = isMovieFoundAfterSearch ? allfilteredmovies : <NotFound />;

  const content = searchInput === "" ? allMovies : areFilteredMoviesFound;

  return (
    <div>

      <header>
        <div className="main-header">
          <h1 className="headerText">MoiveApp</h1>
          <form onSubmit={e => e.preventDefault()} id="form">
            <input onChange={handleInputChange} type="text" value={searchInput} id="search" className="search" placeholder="Search" />
          </form>
        </div>
      </header>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={movies.total_pages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={`pagination ${searchInput !== '' && 'hide-pagination'}`}
        activeClassName={`active`}
        initialPage={movies.page - 1}
        pageClassName={'link'}
      />

      <main id="main">
        {isLoading ? <Loading /> : content}
      </main>

    </div>
  );
}

export default App;
