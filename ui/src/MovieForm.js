import { useState, useEffect } from "react";
import ActorsList from "./ActorsList";
import ActorForm from "./ActorForm";

export default function MovieForm({
    onMovieSubmit,
    buttonLabel,
    initialData = null,
    onCancel
}) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [year, setYear] = useState(initialData?.year || '');
    const [director, setDirector] = useState(initialData?.director || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [actors, setActors] = useState(initialData?.actors || []);
    const [addingActor, setAddingActor] = useState(false);

    const isEditing = !!initialData?.id;

    function handleSubmit(event) {
        event.preventDefault();

        if (title.length < 5) {
            alert('Tytuł jest za krótki');
            return;
        }

        const movieData = {
            id: initialData?.id,
            title,
            year,
            director,
            description,
            actors,
        };

        if (typeof onMovieSubmit === 'function') {
            onMovieSubmit(movieData);
        } else {
            alert('Błąd!!! Brak funkcji onMovieSubmit');
        }

        if (!isEditing) {
            setTitle('');
            setYear('');
            setDirector('');
            setDescription('');
            setActors([]);
        }
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const actorFromServer = await response.json();
            console.log("[MovieForm] Dodaję nowego aktora:", actorFromServer);
            setActors([...actors, actorFromServer]);
            setAddingActor(false);
        } else {
            console.error("Błąd przy dodawaniu aktora");
        }
    }

    async function handleDeleteActor(actor) {
        console.log("Usuwam aktora (DELETE /actor/:id):", actor);
        const response = await fetch(`/actors/${actor.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            setActors(actors.filter(a => a.id !== actor.id));
        } else {
            console.error("Błąd przy usuwaniu aktora");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEditing ? "Edit Movie" : "Add Movie"}</h2>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Year</label>
                <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                />
            </div>
            <div>
                <label>Director</label>
                <input
                    type="text"
                    value={director}
                    onChange={e => setDirector(e.target.value)}
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <ActorsList
                actors={actors}
                onDeleteActor={handleDeleteActor}
            />
            {addingActor ? (
                <ActorForm
                    onActorSubmit={handleAddActor}
                    buttonLabel="Submit actor"
                />
            ) : (
                <button type="button" onClick={() => setAddingActor(true)}>
                    Add an actor
                </button>
            )}

            <button type="submit">
                {buttonLabel || (isEditing ? 'Update Movie' : 'Submit Movie')}
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
}
