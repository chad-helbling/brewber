// express libs
const express = require('express');
const router = express.Router();

//libs
const requestP = require('request-promise');

//components
const arduinoInterface = require('../components/arduino-interface');
arduinoInterface.setupArduino();


/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get("/temperature", (req, res) => { 
  try {
    const temperature = arduinoInterface.getTemperature();
    res.send({temperature});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;