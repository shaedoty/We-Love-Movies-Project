const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");


const addDetails = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });
  

function list() {
  return knex("movies").select("*");
}


function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ movie_id: Number(movieId) })
    .first();
}

function nowPlaying() {
    return knex("movies")
      .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
      .select("movies.*")
      .where({ "movies_theaters.is_showing": true })
      .groupBy("movies.movie_id");
  }

function theaterWithSpecificMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });
}



function movieReviewWithCriticDetail(movieId) {
  return knex("movies")
    .join("reviews", "reviews.movie_id", "movies.movie_id")
    .join("critics", "critics.critic_id", "reviews.critic_id")
    .select("*")
    .where({ "reviews.movie_id": movieId })
    .then((reviews) => {
      const criticDetails = [];
      reviews.forEach((review) => {
        const newCritic = addDetails(review);
        criticDetails.push(newCritic);
      });
      return criticDetails;
    });
}


module.exports = {
  list,
  theaterWithSpecificMovie,
  read,
  nowPlaying,
  movieReviewWithCriticDetail,
};