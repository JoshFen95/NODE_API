// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const axios = require("axios");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.disable("etag");

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

//// GAME METHODS ////
// GET GAMES

// //get games from db
// let getGames = new Promise((resolve) => {
//   axios.get("http://localhost:8080/api/v1/media/GAME")
//   .then((res) => {
//    console.log(res.data)
//   return resolve(res.data);
//   });
// });
let getGames = function () {
  return new Promise((resolve) => {
    // axios get then resolve data
    axios.get("http://localhost:8080/api/v1/media/GAME").then((res) => {
      console.log(res.data);
      return resolve(res.data);
    });
  });
};
//display games at url;
app.get("/games", (req, res) => {
  getGames().then((list) => {
    // console.log(list);
    res.render("games", { listedGames: { content: list } });
  });
});

// PUT GAME
app.post("/games", function (req, res) {
  let game = req.body.game;
  console.log(game);
  axios
    .post("http://localhost:8080/api/v1/media/GAME/add", game)
    .then((res) => {
      // console.log(res.data);
    })
    .catch(() => {
      console.error("Error Occurred");
    });
});

// DELETE GAME
app.delete("/games", function (req, res) {
  console.log("heeeellllo");
  let game = req.params;
  console.log(game);
  axios
    .delete("http://localhost:8080/api/v1/media/GAME/:id", game)
    .then((res) => {
      console.log(res.data);
    })
    .catch(() => {
      console.error("Error Occurred");
    });
});

//// BOOK METHODS ////
// GET BOOKS
let getBooks = function () {
  return new Promise((resolve) => {
    // axios get then resolve data
    axios.get("http://localhost:8080/api/v1/media/BOOK").then((res) => {
      console.log(res.data);
      return resolve(res.data);
    });
  });
};
//display games at url;
app.get("/books", (req, res) => {
  getBooks().then((list) => {
    // console.log(list);
    res.render("books", { listedBooks: { content: list } });
  });
});

// PUT GAME
app.post("/books", function (req, res) {
  let book = req.body.book;
  console.log(book);
  axios
    .post("http://localhost:8080/api/v1/media/BOOK/add", book)
    .then((res) => {
      // console.log(res.data);
    })
    .catch(() => {
      console.error("Error Occurred");
    });
});

//// FILM METHODS ////
// GET FILMS
let getFilms = function () {
  return new Promise((resolve) => {
    // axios get then resolve data
    axios.get("http://localhost:8080/api/v1/media/FILM").then((res) => {
      console.log(res.data);
      return resolve(res.data);
    });
  });
};
//display games at url;
app.get("/films", (req, res) => {
  getFilms().then((list) => {
    // console.log(list);
    res.render("films", { listedFilms: { content: list } });
  });
});

// PUT GAME
app.post("/films", function (req, res) {
  let film = req.body.film;
  console.log(film);
  axios
    .post("http://localhost:8080/api/v1/media/FILM/add", film)
    .then((res) => {
      // console.log(res.data);
    })
    .catch(() => {
      console.error("Error Occurred");
    });
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

//// TO DO ////
// GET REQUESTS FOR Game, BOOK AND FILM
// BE ABLE TO POST BY ENTERING OWN DATA
// DELETE BY ENTERING AN ID
// GET INFOMATION TO DISPLAY ON PAGE
// LOGGING
// ERROR HANDLING
// STYLING
