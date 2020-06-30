const express = require("express");
const axios = require("axios");
const logger = require("winston");
const alert = require("alert");

/**
 * router Variables
 */
// const app = express();
const router = express.Router();

//// GAME METHODS ////

// GET GAMES //

let getGames = function () {
  return new Promise((resolve) => {
    axios
      .get("http://localhost:8080/api/v1/media/game")
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          ///this doesnt work
          console.error(
            "Oops, we seem to be having trouble connecting to the database"
          );
          res.render("error");
        }
        logger.error(err);
      });
  });
};

router.get("/", (req, res) => {
  getGames()
  .then((list) => {
    logger.info(list);
    res.render("games", { listedGames: { content: list } })
    .catch((err) => {
      res.render("error");
    })
  });
});

// PUT GAME //
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
        res.render("error");
      }
      logger.error(err);
    });
});

router.post("/add", function (req, res) {
  let game = req.body.game;
  logger.info(game);
  axios
    .post("http://localhost:8080/api/v1/media/game/add", game)
    .then(() => {
      logger.info(res);
      res.redirect("/games/add");
    })
    .catch((err) => {
      if (err.response.status === 400) {
        alert("Please ensure the correct data is entered");
        res.redirect("/games/add");
      } else {
        console.error("Error Occurred");
        res.render("error");
        throw err;
      }
      logger.error(`An error has occured. ${err}`);
    });
});

// DELETE GAME //
router.get("/delete", (req, res) => {
  getGames().then((list) => {
    res.render("deleteGame", { listedGames: { content: list } });
  });
});

router.post("/delete", function (req, res) {
  let game = req.body.game;
  logger.info(game);
  axios
    .delete("http://localhost:8080/api/v1/media/game/" + game.id)
    .then(() => {
      logger.info(res);
      res.redirect("/games/delete");
    })
    .catch((err) => {
      if (err.response.status === 404) {
        alert("ID could not be found");
      } else {
        console.error("Error Occurred");
        res.render("error");
        throw err;
      }
      logger.error(
        `An error occured. Status Code:${err.response.status}. ${err}`
      );
    });
});

// GET GAME BY ID AND UPDATE//

router.get("/update", (req, res) => {
  getGames().then((list) => {
    res.render("UpdateGame", { listedGames: { content: list } });
  });
});

router.post("/update", function (req, res) {
  let game = req.body.game;
  res.redirect("/games/update/" + game.id);
});

router.get("/update/:id", (req, res) => {
  axios
    .get("http://localhost:8080/api/v1/media/game/" + req.params.id)
    .then((game) => {
      console.log("logging here");
      console.log(game.data.id);
      // logger.info(res);
      res.render("doUpdateGame", { game });
    })
    .catch((err) => {
      if (err.response.status === 404) {
        alert("ID could not be found");
        res.redirect("/games/update");
      } else {
        console.error("Error Occurred");
        res.render("error");
        throw err;
      }
      logger.error(
        `An error occured. Status Code:${err.response.status}. ${err}`
      );
    });
});

router.post("/update/:id/", function (req, res) {
  let game = req.body.game;
  logger.info(game);
  axios
    .put("http://localhost:8080/api/v1/media/game/" + game.id, game)
    .then(() => {
      logger.info(res);
      res.redirect("/games/update");
    })
    .catch((err) => {
      if (err.response.status === 400) {
        alert("Please ensure the correct data is entered");
      }
      if (err.response.status === 404) {
        res.render("error");
        alert("Item not found");
      } else {
        console.error("Error Occurred");
        res.render("error");
        throw err;
      }
      logger.error(`An error has occured. ${err}`);
    });
});

module.exports = router;
