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
    console.log("Dodaję film (POST na /movies):", movie);
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
      console.error("Błąd przy dodawaniu filmu");
    }
  }

  async function addActorsToMovie(movie, actorList) {
    console.log("Dodaję aktorów do filmu (POST /movies/%d/actors):", movie.id);
  
    for (const actor of actorList) {
      const response = await fetch(`/movies/${movie.id}/actors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor),
      });
  
      if (!response.ok) {
        console.error("Błąd przy dodawaniu aktora", actor);
      } else {
        const addedActor = await response.json();
        console.log("Dodano aktora do filmu:", addedActor);
      }
    }
  
    const updatedResponse = await fetch(`/movies/${movie.id}`);
    if (updatedResponse.ok) {
      const updatedMovie = await updatedResponse.json();
      console.log("Zaktualizowany film:", updatedMovie);
      return updatedMovie;
    } else {
      console.error("Błąd przy pobieraniu zaktualizowanego filmu");
      return movie; 
    }
  }

  async function handleEditMovie(movie) {
    console.log("Rozpoczynam edycję filmu:", movie);
    setEditingMovie(movie);
    setAddingMovie(false);
  }

  async function handleUpdateMovie(updatedMovie) {
    console.log("Wysyłam update na /movies/:id:", updatedMovie);
    const response = await fetch(`/movies/${updatedMovie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });

    if (response.ok) {
      const movieFromServer = await response.json();
      
      const newMovies = movies.map(m => (m.id === movieFromServer.id ? movieFromServer : m));
      setMovies(newMovies);
      setEditingMovie(null);
    } else {
      console.error("Błąd przy edycji filmu");
    }
  }

  function cancelEdit() {
    setEditingMovie(null);
  }

  async function handleDeleteMovie(movie) {
    console.log("Usuwam film (DELETE /movies/:id):", movie);
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
      console.error("Błąd przy usuwaniu filmu");
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      console.log("Pobieram filmy (GET /movies)...");
      const response = await fetch(`/movies`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error("Błąd przy pobieraniu filmów");
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
