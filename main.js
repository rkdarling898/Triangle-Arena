import { Game } from "./game.js"
const game = new Game()

game.init()
const player = game.pServ.players[0]

//Setting up canvas
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const sizeCanvas = () => {
    canvas.width = 98*(window.innerWidth/100)
    canvas.height = 98*(window.innerHeight/100)
}

sizeCanvas()
window.addEventListener('resize', sizeCanvas)

//Game loop
game.gameLoop()

//Movement
window.addEventListener('keydown', player.keyDown)
window.addEventListener('keyup', player.keyUp)