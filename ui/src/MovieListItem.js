export default function MovieListItem(props) {
    const { title, year, director, description, actors } = props.movie;

    const actorsString = actors
        .map((actor) => `${actor.name} ${actor.surname}`)
        .join(', ');

    return (
        <div>
            <div>
                <strong>{title}</strong>
                {' '}
                <span>({year})</span>
                {' '}
                directed by {director}
                {' '}
                <a onClick={props.onEdit}>edit</a> <a onClick={props.onDelete}>delete</a>
            </div>

            <div>{description}</div>

            {actors && actors.length > 0 && (
                <p>Stars: {actorsString}</p>
            )}
        </div>
    );
}
