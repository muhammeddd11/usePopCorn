import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovie";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const key = "c5f3ce17";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Search({ query, setQuery }) {
  const inputEle = useRef(null);
  useKey(function () {
    if (document.activeElement === inputEle.current) return;
    inputEle.current.focus();
    setQuery("");
  }, "Enter");

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEle}
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
  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );
  function addMovieToWatch() {
    const newMovie = {
      poster,
      title,
      year,
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      ciuntRatingDesicion: countRef.current,
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
  useKey(onClose, "Escape");
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
function MovieList({ movie, handleDeleteWatched }) {
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
      <button className="btn-delete" onClick={() => handleDeleteWatched(movie)}>
        X
      </button>
    </li>
  );
}

function WatchMovieList({ watched, handleDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <MovieList movie={movie} handleDeleteWatched={handleDeleteWatched} />
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
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, closeSelectedMovie);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function closeSelectedMovie() {
    setSelectedId(null);
  }
  function handleWatchedMovies(movie) {
    setWatched([...watched, movie]);
  }
  function handleDeleteWatched(mvi) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== mvi.imdbID)
    );
  }

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
              <WatchMovieList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
