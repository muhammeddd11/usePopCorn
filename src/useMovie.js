import { useEffect, useState } from "react";
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const key = "c5f3ce17";

  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
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
  );
  return { movies, isLoading, error };
  //only render  the component in the intial render only avoid making tons of requests to the api
}
