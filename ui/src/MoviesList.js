import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>Movies</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.title}>
                <MovieListItem movie={movie} onEdit={() => props.onEditMovie(movie)} onDelete={() => props.onDeleteMovie(movie)} />
            </li>)}
        </ul>
    </div>;
}
