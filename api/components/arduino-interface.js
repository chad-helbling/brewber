const five = require("johnny-five");

let board = {};
let thermometer = {};
let temperature = 0;

const setupArduino = () => {
    board = new five.Board({
        repl: false,
    });
    board.on("ready", () => setupThermometer());
}

const setupThermometer = () => {
    console.log('board ready, setting up thermometer...');
    // This requires OneWire support using the ConfigurableFirmata
    thermometer = new five.Thermometer({
        controller: "DS18B20",
        pin: 3
    });
    console.log('done setting up thermometer...');

    thermometer.on('change', (temperatureData) => {
        // console.log(temperatureData);
        temperature = (temperatureData && temperatureData.fahrenheit) || 0;
    });
};

function handleTemperatureData(temperatureData) {
    console.log(temperatureData);
    temperature = (temperatureData && temperatureData.fahrenheit) || 0;
};

const getTemperature = () => temperature;

module.exports = {
    setupArduino,
    getTemperature,
};