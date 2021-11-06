const five = require("johnny-five");

let board = {};
let thermometer = {};
let pumpRelay = {};
let temperature = 0;

const setupArduino = () => {
    board = new five.Board({
        repl: false,
    });
    board.on("ready", () => {
        console.log('board ready')
        setupThermometer();
        setupPumpRelay();
    });
}

const setupThermometer = () => {
    console.log('setting up thermometer...');
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

const setupPumpRelay = () => {
    console.log('setting up pump relay...');
    pumpRelay = new five.Relay(10);
}

function handleTemperatureData(temperatureData) {
    console.log(temperatureData);
    temperature = (temperatureData && temperatureData.fahrenheit) || 0;
};

const getTemperature = () => temperature;


function togglePumpRelay() {
    if (!Object.keys(pumpRelay).length) {
        console.error('pumpRelay not setup');
        return;
    }


    pumpRelay.toggle();
}

module.exports = {
    setupArduino,
    getTemperature,
    togglePumpRelay,
};