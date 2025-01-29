export default function ActorListItem({ actor, onDelete }) {
    return (
      <span>
        <strong>{actor.name} {actor.surname}</strong>{" "}
        <a onClick={onDelete}>Delete</a>
      </span>
    );
  }
  