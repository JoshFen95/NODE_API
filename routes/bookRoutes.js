const express = require("express");
const path = require("path");
const axios = require("axios");
const logger = require("winston");

/**
 * router2 Variables
 */
// const router2 = express();
const router = express.Router();

let getBooks = function () {
  return new Promise((resolve) => {
    axios.get("http://localhost:8080/api/v1/media/BOOK").then((res) => {
      return resolve(res.data);
    });
  });
};

router.get("/", (req, res) => {
  getBooks().then((list) => {
    logger.info(list);
    res.render("books", { listedBooks: { content: list } });
  });
});

// PUT book
router.get("/add", (req, res) => {
  getBooks()
    .then((list) => {
      res.render("addBook", { listedBooks: { content: list } });
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
  let book = req.body.book;
  logger.info(book);
  axios
    .post("http://localhost:8080/api/v1/media/BOOK/add", book)
    .then(() => {
      logger.info(res);
      res.redirect("/books/add");
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
  // res.redirect("/add");
});

// DELETE book
router.get("/delete", (req, res) => {
  getBooks().then((list) => {
    res.render("deleteBook", { listedBooks: { content: list } });
  });
});

router.post("/delete", function (req, res) {
  let book = req.body.book;
  logger.info(book);
  axios
    .delete("http://localhost:8080/api/v1/media/BOOK/" + book.id)
    .then(() => {

      res.redirect("/books/delete");
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
