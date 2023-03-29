import { Player_Service } from "./entity.js";
import { Bullet_Service } from "./bullets.js";

export class Game {
    constructor () {
        this.canvas = document.getElementById('game')
        this.ctx = this.canvas.getContext('2d')
        this.pServ = new Player_Service(this.canvas)
        this.bServ = new Bullet_Service(this.canvas)
        this.mainPlayer = this.pServ.createPlayer(this.canvas.width/2, this.canvas.height/2, "red", this.bServ, this.bServ.shot_types.basic, false)
        this.GameLoop = this.gameLoop.bind(this)
    }

    init () {
        this.pServ.createPlayer(this.canvas.width/2, this.canvas.height/2, "red", this.bServ, this.bServ.shot_types.basic, false)
        console.log(this.pServ.players)
    }

    update () {
        this.bServ.update()
        this.pServ.update()
    }

    render () {
        this.clearCanvas()
        this.bServ.render(this.ctx)
        this.pServ.render(this.ctx)
    }

    clearCanvas () {
        this.ctx.fillStyle = 'rgb(0, 0, 0, .3)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    gameLoop () {
        this.update()
        this.render()

        requestAnimationFrame(this.GameLoop)
    }
}