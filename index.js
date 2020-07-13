// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
const morgan = require('morgan');
// const logger = require("./logger/winston")


/**
 * App Variables
 */
const app = express();
dotenv.config();

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.set(require("./logger/winston"));



/**
 * Routes Definitions
 */
app.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

// app.use("/game", require("./routes/gameRoutes"));

// app.use("/books", require("./routes/bookRoutes"));

// app.use("/films",require('./routes/filmRoutes'));

app.use("/", require("./routes/genericRoutes")); 

/**
 * Server Activation
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening to requests on http://localhost:${process.env.PORT}`);
});


