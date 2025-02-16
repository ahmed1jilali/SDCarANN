const carCanvas = document.getElementById("carCanvas");
carCanvas.clientWidth = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.clientWidth = 500;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")
];

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 7);
const cars = generateCars(300);
let bestCar = cars[0];

if (localStorage.getItem("bestCar")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestCar"));
}


animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

  //__updating_the_cars
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    car.update(road.borders, traffic);
  }

  //__this_is_to_follow_the_car
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
  road.draw(carCtx);

  //__drawing_the_traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  //__drawing_the_cars
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    car.draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;

  //__drawing_the_best_car
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain)

  requestAnimationFrame(animate);
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(
      new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 7)
    );
  }
  return cars;
}

function save() {
  localStorage.setItem(
    "bestBrain",
    JSON.stringify(bestCar.brain)
  );
}

function discard() {
  localStorage.removeItem("bestBrain");

}
