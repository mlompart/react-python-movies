import './App.css';
import { useState, useEffect } from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
  const [movies, setMovies] = useState([]);
  const [addingMovie, setAddingMovie] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  async function handleAddMovie(movie) {
    console.log("Adding film (POST /movies):", movie);

    const response = await fetch('/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
  
    if (response.ok) {
      const movieFromServer = await response.json();
      const updatedMovie = await addActorsToMovie(movieFromServer, movie.actors);

      setMovies([...movies, updatedMovie]);
      setAddingMovie(false);
    } else {
      console.error("Error during adding a film");
    }
  }

  async function addActorsToMovie(movie, actorList) {
    for (const actor of actorList) {
      const response = await fetch(`/movies/${movie.id}/actors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor),
      });
  
      if (!response.ok) {
        console.error("Error during adding actor ", actor);
      } else {
        const addedActor = await response.json();
        console.log("Added actor to film:", addedActor);
      }
    }
  
    const updatedResponse = await fetch(`/movies/${movie.id}`);
    if (updatedResponse.ok) {
      const updatedMovie = await updatedResponse.json();
      return updatedMovie;
    } else {
      console.error("Error during updating a film");
      return movie; 
    }
  }

  async function handleEditMovie(movie) {
    console.log("Start editing film: ", movie);
    setEditingMovie(movie);
    setAddingMovie(false);
  }

  async function handleUpdateMovie(updatedMovie) {
    console.log("Updating film (PUT /movies):", updatedMovie);

    const response = await fetch(`/movies/${updatedMovie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: updatedMovie.id,
        title: updatedMovie.title,
        year: updatedMovie.year,
        director: updatedMovie.director,
        description: updatedMovie.description
      }),
    });

    if (response.ok) {
      let movieFromServer = await response.json();

      if (updatedMovie.actors && updatedMovie.actors.length > 0) {
        movieFromServer = await addActorsToMovie(movieFromServer, updatedMovie.actors);
      }

      const newMovies = movies.map(m => (m.id === movieFromServer.id ? movieFromServer : m));
      setMovies(newMovies);
      setEditingMovie(null);
    } else {
      console.error("Error during editing film");
    }
  }

  function cancelEdit() {
    setEditingMovie(null);
  }

  async function handleDeleteMovie(movie) {
    const response = await fetch(`/movies/${movie.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      setMovies(movies.filter(m => m.id !== movie.id));
      if (editingMovie && editingMovie.id === movie.id) {
        setEditingMovie(null);
      }
    } else {
      console.error("Error during deleting a film");
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(`/movies`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error("Error during getting films");
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>My favourite movies to watch</h1>

      {movies.length === 0 ? (
        <p>No movies yet. Maybe add something?</p>
      ) : (
        <MoviesList
          movies={movies}
          onDeleteMovie={handleDeleteMovie}
          onEditMovie={handleEditMovie}
        />
      )}

      {addingMovie && !editingMovie && (
        <MovieForm
          onMovieSubmit={handleAddMovie}
          buttonLabel="Submit movie"
          onCancel={() => setAddingMovie(false)}
        />
      )}

      {editingMovie && (
        <MovieForm
          onMovieSubmit={handleUpdateMovie}
          buttonLabel="Update movie"
          initialData={editingMovie}
          onCancel={cancelEdit}
        />
      )}

      {!addingMovie && !editingMovie && (
        <button onClick={() => setAddingMovie(true)}>
          Add a movie
        </button>
      )}
    </div>
  );
}

export default App;
