const express = require("express");
const axios = require("axios");
const logger = require("winston");

const router = express.Router();

// GET FILMS
let getFilms = function () {
  return new Promise((resolve) => {
    axios.get("http://localhost:8080/api/v1/media/film").then((res) => {
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
    .post("http://localhost:8080/api/v1/media/film/add", film)
    .then(() => {
      logger.info(res);
      res.redirect("/films/add");
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
    .delete("http://localhost:8080/api/v1/media/film/" + film.id)
    .then(() => {
      res.redirect("/films/delete");
    })
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
});

// GET filmS BY ID AND UPDATE//

router.get("/update", (req, res) => {
  getFilms().then((list) => {
    res.render("UpdateFilm", { listedFilms: { content: list } });
  });
});

router.post("/update", function (req, res) {
  let film = req.body.film;
  res.redirect("/films/update/" + film.id);
});

router.get("/update/:id", (req, res) => {
  axios
    .get("http://localhost:8080/api/v1/media/film/" + req.params.id)
    .then((film) => {
      console.log("logging here");
      console.log(film.data.id);
      // logger.info(res);
      res.render("doUpdateFilm", { film });
    })
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
});

router.post("/update/:id/", function (req, res) {
  let film = req.body.film;
  logger.info(film);
  axios
    .put("http://localhost:8080/api/v1/media/film/" + film.id, film)
    .then(() => {
      logger.info(res);
      res.redirect("/films");
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
});

module.exports = router;
