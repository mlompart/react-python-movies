from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie = models.Movie.create(**movie.dict())
    return movie


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def delete_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    return db_movie


@app.get("/actors", response_model=List[schemas.Actor])
def get_actors():
    return list(models.Actor.select())


@app.get("/actors/{actor_id}", response_model=schemas.Actor)
def get_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return db_actor


@app.post("/actors", response_model=schemas.Actor)
def add_actor(actor: schemas.ActorBase):
    actor = models.Actor.create(**actor.dict())
    return actor


@app.delete("/actors/{actor_id}", response_model=schemas.Actor)
def delete_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    db_actor.delete_instance()
    return db_actor


@app.post("/movies/{movie_id}/actors", response_model=schemas.Actor)
def add_actor_to_movie(movie_id: int, actor_data: schemas.Actor):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    db_actor = models.Actor.filter(models.Actor.id == actor_data.id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    db_movie.actors.add(db_actor)

    return db_actor


@app.put("/movies/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, updated_data: schemas.MovieBase):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    db_movie.title = updated_data.title
    db_movie.year = updated_data.year
    db_movie.director = updated_data.director
    db_movie.description = updated_data.description
    db_movie.save()

    return db_movie
