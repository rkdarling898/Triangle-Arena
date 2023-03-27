export class Player_Service {
    constructor (canvas) {
        this.players = []
        this.canvas = canvas
    }

    createPlayer (x, y, color, bServ, shot_type) {
        this.players.push(new Player(x, y, color, bServ, shot_type))
    }

    deletePlayer (player) {
        this.players.splice(player, 1)
    }

    update () {
        this.players.forEach((player) => {
            player.update(this.canvas)
        })
    }

    render (ctx) {
        this.players.forEach((player) => {
            player.render(ctx)
        })
    }
}

export class Player {
    constructor (x, y, color, bServ, shot_type) {
        this.x = x
        this.y = y
        this.size = 20
        this.spd = 5
        this.color = color
        this.bServ = bServ
        this.shot_type = shot_type
        this.direction = 'down'
        this.keyDown = this.keydown.bind(this)
        this.keyUp = this.keyup.bind(this)
    }

    update (canvas) {
        if (this.upPressed && this.y > 23) this.y -= this.spd

        if (this.leftPressed && this.x > 23) this.x -= this.spd

        if (this.downPressed && this.y < canvas.height - 23) this.y += this.spd

        if (this.rightPressed && this.x < canvas.width - 23) this.x += this.spd
    }
    
    render (ctx) {
        if (this.isShooting) {
            this.shoot()
        }

        ctx.fillStyle = "white"
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 25, this.y + 25);
        ctx.lineTo(this.x + 25, this.y - 25);
        ctx.fill();
    }

    shoot () {
        this.bServ.createBullet(this.x, this.y, this.shot_type, this.color, this.direction)
    }

    keydown (e) {
        switch (e.code) {
            case 'KeyW':
                this.upPressed = true
                this.direction = 'up'
                break
            case 'KeyA':
                this.leftPressed = true
                this.direction = 'left'
                break
            case 'KeyS':
                this.downPressed = true
                this.direction = 'down'
                break
            case 'KeyD':
                this.rightPressed = true
                this.direction = 'right'
                break
            case 'Space':
                this.isShooting = true
        }
    }

    keyup (e) {
        switch (e.code) {
            case 'KeyW':
                this.upPressed = false
                break
            case 'KeyA':
                this.leftPressed = false
                break
            case 'KeyS':
                this.downPressed = false
                break
            case 'KeyD':
                this.rightPressed = false
                break
            case 'Space':
                this.isShooting = false
        }
    }
}