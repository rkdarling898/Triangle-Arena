import { Game } from "./game.js"

//Setting up canvas
const canvas = document.getElementById('game')

const sizeCanvas = () => {
    canvas.width = 98*(window.innerWidth/100)
    canvas.height = 98*(window.innerHeight/100)
}

sizeCanvas()
window.addEventListener('resize', sizeCanvas)

//Initialize game & gameloop
const game = new Game()

game.init()
const player = game.pServ.players[0]

game.gameLoop()

//Movement
window.addEventListener('keydown', player.keyDown)
window.addEventListener('keyup', player.keyUp)