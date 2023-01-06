const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const foundMovie = await moviesService.read(req.params.movieId);
  if (foundMovie) {
    res.locals.foundMovie = foundMovie;
    return next();
  } else {
    return next({
      status: 404,
      message: "Movie cannot be found.",
    });
  }
}

async function list(req, res) {
  if (req.query.is_showing) {
    res.send({ data: await moviesService.nowPlaying() });
  } else {
    res.send({ data: await moviesService.list() });
  }
}

async function read(req, res) {
  res.send({ data: res.locals.foundMovie });
}

async function theaterWithSpecificMovie(req, res) {
  const data = await moviesService.theaterWithSpecificMovie(
    res.locals.foundMovie.movie_id
  );
  res.send({ data });
}

async function movieReviewWithCriticDetail(req, res) {
  const data = await moviesService.movieReviewWithCriticDetail(
    res.locals.foundMovie.movie_id
  );
  res.send({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  theaterWithSpecificMovie: [
    asyncErrorBoundary(movieExists),
    theaterWithSpecificMovie,
  ],
  movieReviewWithCriticDetail: [movieExists, movieReviewWithCriticDetail],
};
