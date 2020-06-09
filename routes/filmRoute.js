const express = require("express");
const path = require("path");
const axios = require("axios");
const logger = require("winston");

const router = express.Router();

// GET FILMS
let getFilms = function () {
  return new Promise((resolve) => {
    axios.get("http://localhost:8080/api/v1/media/FILM").then((res) => {
      return resolve(res.data);
    });
  });
};

router.get("/", (req, res) => {
  getFilms().then((list) => {
    logger.info(list);
    res.render("films", { listedFilms: { content: list } });
  });
});

// PUT film
router.get("/add", (req, res) => {
  getFilms()
    .then((list) => {
      res.render("addFilm", { listedFilms: { content: list } });
    })
    .catch((err) => {
      if (err.response.status === 500) {
        ///this doesnt work
        console.error(
          "Oops, we seem to be having trouble connecting to the database"
        );
      }
      logger.error(err);
    });
});

router.post("/add", function (req, res) {
  let film = req.body.film;
  logger.info(film);
  axios
    .post("http://localhost:8080/api/v1/media/FILM/add", film)
    .then((res) => {
      logger.info(res);
    })
    .catch((err) => {
      if (err.response.status === 400) {
        console.error("Please ensure the correct data is entered");
      } else {
        console.error("Error Occurred");
        throw err;
      }
      logger.error(`An error has occured. ${err}`);
    });
  res.redirect("/films/add");
});

// DELETE film
router.get("/delete", (req, res) => {
  getFilms().then((list) => {
    res.render("deleteFilm", { listedFilms: { content: list } });
  });
});

router.post("/delete", function (req, res) {
  let film = req.body.film;
  logger.info(film);
  axios
    .delete("http://localhost:8080/api/v1/media/FILM/" + film.id)
    .then((res) => {})
    .catch((err) => {
      if (err.response.status === 404) {
        console.log("ID could not be found");
      } else {
        console.error("Error Occurred");
        throw err;
      }
      logger.error(
        `An error occured. Status Code:${err.response.status}. ${err}`
      );
    });
  res.redirect("/films/delete");
});

module.exports = router;
