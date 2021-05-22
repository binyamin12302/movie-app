import Axios from "axios";
import { useEffect, useState } from "react";
import Movie from "./Movie";

function App() {
  const [movies, setMovies] = useState({
    page: 1,
    results: [],
    total_pages: 500
  });

  const [searchInput, setSearchInput] = useState("");
  const [filteredmovies, setFilteredmovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&page=${movies.page}`);
        setMovies(response.data);
      } catch (e) {
        console.log("There was a problem.");
      }
    }

    fetchData();
  }, [movies.page]);

  useEffect(() => {
    if (searchInput) {
      async function searchData() {
        try {
          const response = await Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fc974e5e89d3cfba7e0fee335ffc7bfa&query="${searchInput}"`);
          setFilteredmovies(response.data.results);
        } catch (e) {
          console.log("There was a problem.");
        }
      }
      searchData();
    }
  }, [searchInput]);

  function handleNextClick() {
    window.scrollTo(0, 0);
    setMovies(prevstate => {
      return { ...prevstate, page: prevstate.page + 1 };
    });
  }

  function handlePreviousClick() {
    window.scrollTo(0, 0);
    setMovies(prevstate => {
      return { ...prevstate, page: prevstate.page - 1 };
    });
  }

  const allMoivies = movies.results.map((movie, index) => {
    return <Movie movie={movie} key={index} />;
  });

  const allfilteredmovies = filteredmovies.map((movie, index) => {
    return <Movie movie={movie} key={index} />;
  });

  return (
    <div>
      <header>
        <form onSubmit={e => e.preventDefault()} id="form">
          <input onChange={e => setSearchInput(e.target.value)} type="text" value={searchInput} id="search" className="search" placeholder="Search" />
        </form>
      </header>
      <main id="main">{searchInput !== "" ? allfilteredmovies : allMoivies}</main>
      <div className="pagintion">
        {movies.page > 1 && searchInput === "" && <input type="button" onClick={handlePreviousClick} className="previous" value="Previous" />}
        {movies.page >= 1 && movies.page !== 500 && searchInput === "" && <input type="button" onClick={handleNextClick} className="next" value="Next" />}
      </div>
    </div>
  );
}

export default App;
