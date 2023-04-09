// imports
import { Car } from "./Car.js"
import { Road } from "./Road.js"

const canvas = document.getElementById("canvas")

canvas.width = 280

const ctx = canvas.getContext("2d")

const road = new Road(canvas.width/2, canvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 60, "KEYS", 4)

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 60, "DUMMY")
]

animate()

function animate() {
    for (let c of traffic) {
        c.update([], [])
    }
    car.update(road.borders, traffic)
    canvas.height = window.innerHeight
    ctx.save()
    ctx.translate(0, -car.position.y+canvas.height*0.7)

    road.draw(ctx)
    car.draw(ctx, "royalblue")
    for (let c of traffic) {
        c.draw(ctx, "gray")
    }
    ctx.restore()
    requestAnimationFrame(animate)
}