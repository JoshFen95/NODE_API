const express = require("express");
const axios = require("axios");
const winston = require("winston");
const alert = require("alert");


const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize({all: true}),
    winston.format.prettyPrint()
  )
});
/**
 * router Variables
 */
// const app = express();
const router = express.Router();

//// GAME METHODS ////

// GET GAMES //



let getItems = function (itemType) {
  return new Promise((resolve) => {
    axios
      .get("http://localhost:8080/api/v1/media/"+itemType)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          ///this doesnt work
            
            logger.log('error', 'Oops, we seem to be having trouble connecting to the database. ' + err);
          
          res.render("error");
        } else {
          logger.log('error',err);
          res.render("error");
        }
        
      });
  });
};

router.get("/:variable", (req, res) => {
  let itemType = req.params.variable;
  getItems(itemType)
  .then((list) => {
    logger.log('info', list);
    res.render(itemType, { listedItems: { content: list } })
  })
    .catch((err) => {
      res.render("error");
      logger.log('error',err);
    });
  });


// PUT GAME //
router.get("/:variable/add", (req, res) => {
  let itemType = req.params.variable;
  getItems(itemType)
    .then((list) => {
      res.render("add"+itemType, { listedItems: { content: list } });
    })
    .catch((err) => {
      if (err.response.status === 500) {
        ///this doesnt work
        logger.log('error',err);
        console.error(
          "Oops, we seem to be having trouble connecting to the database"
        );
        res.render("error");
      } else {
        logger.log('error',err);
        res.render("error");
        res
      }
    
    });
});

router.post("/:variable/add", function (req, res) {
  let itemType = req.params.variable;
  let item = req.body.item;
  axios
    .post("http://localhost:8080/api/v1/media/" + itemType + "/add", item)
    .then(() => {
      logger.log('info', res);
      res.redirect("/"+itemType+"/add");
    })
    .catch((err) => {
      if (err.response.status === 400) {
        logger.log('error',err);
        logger.log('info', item);
        alert("Please ensure the correct data is entered");
        res.redirect("/"+itemType+ "/add");
      }
      if (err.response.status === 409) {
        alert("Item already exists in the database")
        res.redirect("/"+itemType+ "/add");
      }
      else {
        logger.log('error',err);
        res.render("error");
        throw err;
      }
      // logger.log('error',err);
    });
});

// // DELETE GAME //
// router.get("/:varible/delete", (req, res) => {
//   let itemType = req.params.variable;
//   getItems(itemType)
//   .then((list) => {
//     res.render("delete"+itemType, { listedItems: { content: list } });
//   });
// });

router.get("/:variable/delete", (req, res) => {
  let itemType = req.params.variable;
  getItems(itemType)
    .then((list) => {
      res.render("delete"+itemType, { listedItems: { content: list } });
    })
    .catch((err) => {
      if (err.response.status === 500) {
        ///this doesnt work
        logger.log('error',err);
        console.error(
          "Oops, we seem to be having trouble connecting to the database"
        );
        res.render("error");
      } else {
        logger.log('error',err);
        res.render("error");
        res
      }
    
    });
});



router.post("/:variable/delete", function (req, res) {
  let itemType = req.params.variable;
  let item = req.body.item;
  console.log(item.id);
  logger.log('info',item);
  axios
    .delete("http://localhost:8080/api/v1/media/" + itemType + "/" + item.id)
    .then(() => {
      logger.log('info',res);
      res.redirect("/"+itemType+ "/delete");
    })
    .catch((err) => {
      if (err.response.status === 404) {
        alert("ID could not be found");
      } else {
        logger.log('error',err);
        res.render("error");
        throw err;
      }
      logger.log('error',err);
    });
});

// GET GAME BY ID AND UPDATE//

router.get("/:variable/update", (req, res) => {
  let itemType = req.params.variable;
  getItems(itemType).then((list) => {
    res.render("update"+itemType, { listedItems: { content: list } });
  });
});

router.post("/:variable/update", function (req, res) {
  let item = req.body.item;
  res.redirect("/" + req.params.variable + "/update/" + item.id);
});

router.get("/:variable/update/:id", (req, res) => {
  let itemType = req.params.variable;
  axios
    .get("http://localhost:8080/api/v1/media/" + itemType +"/" + req.params.id)
    .then((item) => {
      logger.log('info',item.data);

      res.render("doUpdate"+itemType, { item });
    })
    .catch((err) => {
      if (err.response.status === 404) {
        alert("ID could not be found");
        res.redirect("/:variable/update");
      } else {
        logger.log('error',err);
        res.render("error");
      }
      logger.log('error',err);
    });
});

router.post("/:variable/update/:id/", function (req, res) {
  let itemType = req.params.variable;
  let item = req.body.item;
  logger.log('info',item);
  axios
    .put("http://localhost:8080/api/v1/media/"+itemType+ "/" + item.id, item)
    .then(() => {
      logger.log('info',item);
      res.redirect("/"+itemType+ "/update");
    })
    .catch((err) => {
      if (err.response.status === 400) {
        alert("Please ensure the correct data is entered");
      }
      if (err.response.status === 404) {
        res.render("error");
        alert("Item not found. New item added to DB");
      } else {
        logger.log('error',err);
        res.render("error");
     
      }
      logger.log('error',err);
    });
});

module.exports = router;
