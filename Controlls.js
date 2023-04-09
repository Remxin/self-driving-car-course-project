export class Controlls {
    constructor(controlType) {
        this.forward = false
        this.left = false
        this.right = false
        this.reverse = false

        switch (controlType) {
            case "KEYS":
                this.#addEventsListeners()
                break
            case "DUMMY":
                this.forward = true
                break
        }
    }

    #addEventsListeners() { // private method
        window.onkeydown = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = true
                    break
                case "ArrowRight":
                    this.right = true
                    break
                case "ArrowUp":
                    this.forward = true
                    break
                case "ArrowDown":
                    this.reverse = true
                    break
            }
        }

        window.onkeyup = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = false
                    break
                case "ArrowRight":
                    this.right = false
                    break
                case "ArrowUp":
                    this.forward = false
                    break
                case "ArrowDown":
                    this.reverse = false
                    break
            }
        }
    }
}