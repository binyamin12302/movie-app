import Axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Movie from "./Movie";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { debounce } from "lodash";
import "./css/Style.css";
import "./css/Mobile.css";
import ReactPaginate from 'react-paginate';

function App() {
  const [movies, setMovies] = useState({
    page: JSON.parse(localStorage.getItem('allTasks')) || 1,
    results: [],
    total_pages: 500
  });

  const [searchInput, setSearchInput] = useState("");
  const [filteredmovies, setFilteredmovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(false);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=${movies.page}`, { cancelToken: ourRequest.token });
        setMovies(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem ww.");
      }
    }
    fetchData();

    return () => {
      ourRequest.cancel();
    };
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

  function handlePageClick(data) {

    let selected = data.selected

    if (selected) {
      selected++
    } else {
      selected = 1
    }

    setIsLoading(true);
    setMovies(prevstate => {
      return { ...prevstate, page: selected };
    });


    saveInLocalStorage(selected)
  }


  function saveInLocalStorage(data) {
    localStorage.setItem("allTasks", JSON.stringify(data));
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
        {content}
      </main>

    </div>
  );
}

export default App;
