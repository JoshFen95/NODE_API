// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
var cors = require("cors");
const axios = require("axios");
var promise = require("promise");
var bodyParser = require("body-parser");

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

var getGames = new Promise((resolve, reject) => {
  // axios get then resolve data

  axios.get("http://localhost:8080/api/v1/media/GAME").then((res) => {
    resolve(res.data);
  });
  return getGames;
});

app.get("/games", (req, res) => {
  getGames.then((list) => {
    console.log(list);
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
      console.log(res.data);
    })
    .catch(() => {
      console.error("Error Occurred");
    });
});

// DELETE GAME
app.get("/delete", function (req, res) {
  axios
    .delete("http://localhost:8080/api/v1/media/GAME/5eb00d3945f6bc46887d8a75")
    .then((res) => {
      console.log(res.data);
    });
});

//// BOOK METHODS ////
// GET BOOKS
var getBooks = new Promise((resolve, reject) => {
  // axios get then resolve data

  axios.get("http://localhost:8080/api/v1/media/BOOK").then((res) => {
    resolve(res.data);
  });
  return getBooks;
});

app.get("/books", (req, res) => {
  getBooks.then((list) => {
    console.log(list);
    res.render("books", { listedBooks: { content: list } });
  });
});

//// FILM METHODS ////
// GET FILMS
var getFilms = new Promise((resolve, reject) => {
  // axios get then resolve data

  axios.get("http://localhost:8080/api/v1/media/FILM").then((res) => {
    resolve(res.data);
  });
  return getFilms;
});

app.get("/films", (req, res) => {
  getFilms.then((list) => {
    console.log(list);
    res.render("films", { listedFilms: { content: list } });
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
