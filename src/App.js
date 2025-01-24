import { use, useEffect, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const key = "c5f3ce17";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

function Movie({ movie, setSelectedId }) {
  return (
    <>
      <li onClick={() => setSelectedId(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}

function ListOfMovies({ movies, setSelectedId, onClose }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie
            movie={movie}
            key={movie.imdbID}
            setSelectedId={setSelectedId}
          />
        ))}
      </ul>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>
    </>
  );
}

function Watched({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched?.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function MovieDetails({ selectedId, onClose, handleWatchedMovies, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Director: director,
    Actors: actors,
    Plot: plot,
    Genre: genre,
  } = movie;
  function addMovieToWatch() {
    const newMovie = {
      poster,
      title,
      title,
      year,
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    handleWatchedMovies(newMovie);
  }
  const isWatched = watched.map((el) => el.imdbID).includes(selectedId);
  const watchedRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "Use PopCorn";
      };
    },
    [title]
  );
  useEffect(
    function () {
      const callback = function (e) {
        if (e.code === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onClose]
  );
  return (
    <>
      <dev className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onClose}>
                &larr;{" "}
              </button>
              <img src={poster} alt={`Poster of ${title} film`} />

              <div class="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} {runtime}
                </p>
                <p>{genre}</p>
                <p>⭐ {imdbRating}</p>
              </div>
            </header>
            <section>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed By {director}</p>
            </section>
            (
            {isWatched ? (
              <p>you rated this movie {watchedRating}⭐</p>
            ) : (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={24}
                  // messages={["Terrible", "Bad", "Not Bad", "Okay", "Amazing"]}
                  defaultReating={3}
                  onSetRating={setUserRating}
                />
                {userRating && (
                  <button class="btn-add" onClick={addMovieToWatch}>
                    + Add to watch list
                  </button>
                )}
              </div>
            )}
            )
          </>
        )}
      </dev>
      ;
    </>
  );
}
function MovieList({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchMovieList({ watched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <MovieList movie={movie} />
        ))}
      </ul>
    </>
  );
}

function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Loader() {
  return <p class="loader">Loading...</p>;
}
function Error({ msg }) {
  return <p className="error">⛔ {msg}</p>;
}
export default function App() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const movies = localStorage.getItem("watched");
    return movies ? JSON.parse(movies) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  //const tempQuery = "inception";
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const controller = new AbortController();

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function closeSelectedMovie() {
    setSelectedId(null);
  }
  function handleWatchedMovies(movie) {
    setWatched([...watched, movie]);
  }
  // function handleDeleteWatched(mvi) {
  //   setWatched((watched) =>
  //     watched.filter((movie) => movie.imdbID !== mvi.imdb)
  //   ); implement the feature of remove a movie from watch list tomorrow
  // }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  useEffect(
    function () {
      async function fetchingMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&
        &s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            setError(true);
            throw new Error("Movie does not found");
          }
          const movies = await res.json();
          setMovies(movies.Search);
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchingMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  ); //only render  the component in the intial render only avoid making tons of requests to the api
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        {/*
          explicity passing jsx as a prop using prop elemen
        <Box element={<>
        <Watched watched={watched} />
          <WatchMovieList watched={watched} />
        </>} */}

        {/* //impicity passing the jsx as a prop {component composition} */}
        <Box movies={movies}>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <ListOfMovies movies={movies} setSelectedId={handleSelectedId} />
          )}
          {!isLoading && error && <Error msg={error} />}
          {/* {isLoading ? <Loader /> : <ListOfMovies movies={movies} />} */}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={closeSelectedMovie}
              handleWatchedMovies={handleWatchedMovies}
              watched={watched}
            />
          ) : (
            <>
              <Watched watched={watched} />
              <WatchMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
