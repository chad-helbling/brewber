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

router.get('/weather', (req, res) => {
  var options = {
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
        zip:'58554,us',
        units:'imperial',
        APPID: '180d91a0913868b97add8df82152bb9a'
    },
    json: true // Automatically parses the JSON string in the response
};

requestP(options)
    .then((tempData) => res.send(tempData.main))
    .catch((err) => {
      console.error(err)
      res.sendStatus(500);
    });

})

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