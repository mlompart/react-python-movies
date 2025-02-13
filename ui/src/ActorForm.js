import { useState } from "react";

export default function ActorForm({ onActorSubmit, buttonLabel }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  function addActor() {
    console.log("[ActorForm] addActor, name: %s, surname: %s", name, surname);

    if (name.length < 3 || surname.length < 3) {
      alert('Imię lub nazwisko aktora jest zbyt krótkie');
      return;
    }

    if (typeof onActorSubmit === 'function') {
      onActorSubmit({ name, surname });
    } else {
      console.error('onActorSubmit is not a function!');
    }
    setName('');
    setSurname('');
  }

  return (
    <div>
      <h3>Add Actor</h3>
      <div>
        <label>Actor Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
         <label>Actor Surname</label>
        <input
          type="text"
          value={surname}
          onChange={e => setSurname(e.target.value)}
        />
        <button type="button" onClick={addActor}>
          {buttonLabel || 'Submit actor'}
        </button>
      </div>
    </div>
  );
}
