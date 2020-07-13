const winston = require("winston");


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

module.exports = logger;