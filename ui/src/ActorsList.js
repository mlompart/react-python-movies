import ActorListItem from "./ActorListItem";

export default function ActorsList({ actors, onDeleteActor }) {
  if (!Array.isArray(actors)) {
    console.error('props.actors should be a table!');
    return null;
  }

  return (
    <div>
      <h3>Actors</h3>
      {actors.length === 0 ? (
        <p>No actors added yet. Add one!</p>
      ) : (
        <ul className="actor-list">
          {actors.map((actor, index) => (
            <li key={actor.id || index}>
              <ActorListItem
                actor={actor}
                onDelete={() => onDeleteActor(actor)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
