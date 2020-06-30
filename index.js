// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const dotenv = require('dotenv');

/**
 * App Variables
 */
const app = express();
// const port = process.env.PORT || "8000";
dotenv.config();

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
  res.render("home", { title: "Home" });
});

app.use("/games", require("./routes/gameRoutes"));

app.use("/books", require("./routes/bookRoutes"));

app.use("/films",require('./routes/filmRoutes'));

/**
 * Server Activation
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening to requests on http://localhost:${process.env.PORT}`);
});


