import { Controlls } from "./Controlls.js"
import { Sensor } from "./Sensor.js"
import { polysIntersect } from "./utils.js"

export class Car {
    constructor(x, y, width, heigth, controlType, maxSpeed = 3) {
        this.position = { x, y }
        this.heigth = heigth
        this.width = width
        this.angle = 0
        this.damaged = false
        
        this.speed = 0
        this.acceleration = 0.2
        this.friction = 0.1
        this.maxSpeed = maxSpeed

        if (controlType !== "DUMMY") this.sensor = new Sensor(this)
        
        this.controlls = new Controlls(controlType)
    }

    update(roadBorders, traffic) {
        if (this.damaged) return
        this.#move()
        this.polygon = this.#createPolygon()
        this.damaged = this.#assessDamage(roadBorders, traffic)
        if(this.sensor) this.sensor.update(roadBorders, traffic)
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) return true
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) return true
        }
        return false
    }

    #createPolygon() {
        const points = []
        const rad = Math.hypot(this.width, this.heigth)/2
        const alpha = Math.atan2(this.width, this.heigth)

        // top right
        points.push({
            x: this.position.x - Math.sin(this.angle-alpha)*rad,
            y: this.position.y - Math.cos(this.angle-alpha)*rad
        })

        points.push({
            x: this.position.x - Math.sin(this.angle+alpha)*rad,
            y: this.position.y - Math.cos(this.angle+alpha)*rad
        })

        points.push({
            x: this.position.x - Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.position.y - Math.cos(Math.PI+this.angle-alpha)*rad
        })

        points.push({
            x: this.position.x - Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.position.y - Math.cos(Math.PI+this.angle+alpha)*rad
        })

        return points

    }

    #move() {
        if (this.controlls.forward) {
            this.speed += this.acceleration
        } 
        if (this.controlls.reverse) {
            this.speed -= this.acceleration
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1:-1
            if (this.controlls.left) {
                this.angle += 0.05*flip
            }
    
            if (this.controlls.right) {
                this.angle -= 0.05*flip
            }
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
        }

        if (this.speed < -this.maxSpeed/2) {
            this.speed = -this.maxSpeed/2
        }

        if (this.speed > 0 ) {
            this.speed -= this.friction
        } else if (this.speed < 0) {
            this.speed += this.friction
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0
        }
        
        this.position.x -= Math.sin(this.angle)*this.speed
        this.position.y -= Math.cos(this.angle)*this.speed
    }

    draw(ctx, color) {
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

        if (this.damaged) ctx.fillStyle = "tomato"
        else ctx.fillStyle = color

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }

        ctx.fill()

        if (this.sensor) this.sensor.draw(ctx)
    }
}