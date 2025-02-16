const carCanvas = document.getElementById("carCanvas");
carCanvas.clientWidth = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.clientWidth = 500;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 7);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")
];
car.draw(carCtx);

animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  //__this_is_to_follow_the_car
  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7)

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  car.draw(carCtx, "blue");

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, car.brain)

  requestAnimationFrame(animate);
}
