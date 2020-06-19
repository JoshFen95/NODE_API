const express = require("express");
const path = require("path");
const axios = require("axios");
const logger = require("winston");

/**
 * router Variables
 */
// const app = express();
const router = express.Router();

//// GAME METHODS ////
// GET games

let getGames = function () {
  return new Promise((resolve) => {
    axios.get("http://localhost:8080/api/v1/media/GAME").then((res) => {
      return resolve(res.data);
    });
  });
};

router.get("/", (req, res) => {
  getGames().then((list) => {
    logger.info(list);
    res.render("games", { listedGames: { content: list } });
  });
});

// PUT game
router.get("/add", (req, res) => {
  getGames()
    .then((list) => {
      res.render("addGame", { listedGames: { content: list } });
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
  let game = req.body.game;
  logger.info(game);
  axios
    .post("http://localhost:8080/api/v1/media/GAME/add", game)
    .then(() => {
      logger.info(res);
      res.redirect("/games/add");

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

// DELETE games
router.get("/delete", (req, res) => {
  getGames().then((list) => {
    res.render("deleteGame", { listedGames: { content: list } });
  });
});

router.post("/delete", function (req, res) {
  let game = req.body.game;
  logger.info(game);
  axios
    .delete("http://localhost:8080/api/v1/media/GAME/" + game.id)
    .then(() => {
      logger.info(res);
      res.redirect("/games/delete");
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

module.exports = router;
