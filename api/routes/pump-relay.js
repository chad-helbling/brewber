const express = require('express');
const router = express.Router();

const { togglePumpRelay } = require('../components/arduino-interface.js');

router.post('/', (req, res) => { 
  try {
    togglePumpRelay();
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;