export class Player_Service {
    constructor (canvas) {
        this.players = []
        this.canvas = canvas
    }

    createPlayer (x, y, color, bServ, shot_type, isCom) {
        this.players.push(new Player(x, y, color, bServ, shot_type, isCom))
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
    constructor (x, y, color, bServ, shot_type, isCom) {
        this.x = x
        this.y = y
        this.spd = 5
        this.points = {
            origin: {x: this.x, y: this.y - 12.5},
            left: {x: this.x - 20, y: this.y + 12.5},
            right: {x: this.x + 20, y: this.y + 12.5},
        }
        this.color = color
        this.bServ = bServ
        this.shot_type = shot_type
        this.angle = 0
        this.isCom = isCom
        this.keyDown = this.keydown.bind(this)
        this.keyUp = this.keyup.bind(this)
    }

    update (canvas) {
        if (this.upPressed && !this.outOfBounds('y', 'min', canvas)) this.updatePoints('y', 'negative')

        if (this.leftPressed && !this.outOfBounds('x', 'min', canvas)) this.updatePoints('x', 'negative')

        if (this.downPressed && !this.outOfBounds('y', 'max', canvas)) this.updatePoints('y', 'positive')

        if (this.rightPressed && !this.outOfBounds('x', 'max', canvas)) this.updatePoints('x', 'positive')
    }

    updatePoints (ordinate, change) {
        const ord = ordinate

        if (change === 'positive') {
            this[ord] += this.spd
            this.points.origin[ord] += this.spd
            this.points.left[ord] += this.spd
            this.points.right[ord] += this.spd
        } else {
            this[ord] -= this.spd
            this.points.origin[ord] -= this.spd
            this.points.left[ord] -= this.spd
            this.points.right[ord] -= this.spd
        }
    }

    outOfBounds (ordinate, minOrMax, canvas) {
        const ord = ordinate
        const type = minOrMax

        if (ord === 'x') {
            if (type === 'min') {
                if (this.points.origin.x < 4 || this.points.left.x < 4 || this.points.right.x < 4) {
                    return true
                } else return false
            } else {
                if (this.points.origin.x > canvas.width + 4 || this.points.left.x > canvas.width + 4 || this.points.right.x > canvas.width + 4) {
                    return true
                } else return false
            }
        } else if (ord === 'y') {
            if (type === 'min') {
                if (this.points.origin.y < 4 || this.points.left.y < 4 || this.points.right.y < 4) {
                    return true
                } else return false
            } else {
                if (this.points.origin.y > canvas.height + 4 || this.points.left.y > canvas.height + 4 || this.points.right.y > canvas.height + 4) {
                    return true
                } else return false
            }
        }
    }
    
    render (ctx) {
        if (this.isShooting) this.shoot()
        if (this.jPressed) this.decreaseAng()
        if (this.kPressed) this.increaseAng()

        //Rotate player based on angle
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        //Set line color and width
        ctx.lineWidth = 3
        ctx.strokeStyle = this.color
        ctx.stroke()

        //Draw character triangle
        ctx.beginPath();
        ctx.moveTo(0, -12.5);
        ctx.lineTo(20, 12.5);
        ctx.lineTo(-20, 12.5);
        ctx.closePath()

        ctx.restore()
    }

    shoot () {
        this.bServ.createBullet(this.x, this.y, this.shot_type, this.color, this.direction)
    }

    increaseAng () {
        const deg = Math.PI/180
        
        if ((this.angle + 15*deg) > 2*Math.PI) {
            this.angle = (this.angle + 15*deg) - 2*Math.PI
        } else {
            this.angle += 15*deg
        }
    }

    decreaseAng () {
        const deg = Math.PI/180

        if ((this.angle - 15*deg) < 0) {
            this.angle = (this.angle - 15*deg) + 2*Math.PI
        } else {
            this.angle -= 15*deg
        }
    }

    keydown (e) {
        switch (e.code) {
            case 'KeyW':
                this.upPressed = true
                break
            case 'KeyA':
                this.leftPressed = true
                break
            case 'KeyS':
                this.downPressed = true
                break
            case 'KeyD':
                this.rightPressed = true
                break
            case 'KeyJ':
                this.jPressed = true
                console.log('left')
                break
            case 'KeyK':
                this.kPressed = true
                console.log('right')
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
            case 'KeyJ':
                this.jPressed = false
                break
            case 'KeyK':
                this.kPressed = false
                break
            case 'Space':
                this.isShooting = false
        }
    }
}