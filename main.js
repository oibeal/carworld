const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * .9);
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", "blue", 2)
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    traffic.forEach(car => car.update(road.borders, []));
    cars.forEach(car => car.update(road.borders, traffic));
    bestCar = cars.find(car => car.y === Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * .7);
    road.draw(carCtx);
    traffic.forEach(car => car.draw(carCtx));
    carCtx.globalAlpha = .3;
    cars.forEach(car => car.draw(carCtx));
    carCtx.globalAlpha = 1;
    // Emphasize first car
    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}