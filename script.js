// imports
import { Car } from "./Car.js"
import { Road } from "./Road.js"
import { Visualizer } from "./Visualizer.js"
import { NeuralNetwork } from "./Network.js"

// buttons onclicks
const btns = {
    save: document.getElementById("save-brain"),
    discard: document.getElementById("discard-brain")
}

btns.save.onclick = saveBrain
btns.discard.onclick = discardBrain
// simulation logic
const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 280

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 420

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9)
const N = 120
const cars = generateCars(N)
let bestCar = cars[0]

if(localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
    }
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"))
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(0), -300, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(2), -400, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(3), -550, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(2), -650, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(3), -650, 30, 60, "DUMMY"),
    new Car(road.getLaneCenter(1), -800, 30, 60, "DUMMY")
]

animate()

function saveBrain() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discardBrain() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = []
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 60, "AI", 4))
    }

    return cars
}

function animate(time) {
    for (let c of traffic) {
        c.update([], [])
    }
    for (let car of cars) {
        car.update(road.borders, traffic)
    }
    // finding the best car
    bestCar = cars.find(
        car => car.position.y===Math.min(...cars.map(c => c.position.y))
    )


    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0, -bestCar.position.y+carCanvas.height*0.7)

    road.draw(carCtx)

    carCtx.globalAlpha = 0.2
    for (let car of cars) {
        car.draw(carCtx, "royalblue")
    }
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "royalblue", true)

    for (let c of traffic) {
        c.draw(carCtx, "gray")
    }
    carCtx.restore()

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}