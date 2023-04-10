// imports
import { Car } from "./Car.js"
import { Road } from "./Road.js"
import { Visualizer } from "./Visualizer.js"

const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 280

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 420

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 60, "AI", 4)

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 60, "DUMMY")
]

animate()

function animate(time) {
    for (let c of traffic) {
        c.update([], [])
    }
    car.update(road.borders, traffic)
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0, -car.position.y+carCanvas.height*0.7)

    road.draw(carCtx)
    car.draw(carCtx, "royalblue")
    for (let c of traffic) {
        c.draw(carCtx, "gray")
    }
    carCtx.restore()

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate)
}