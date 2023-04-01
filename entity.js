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
            top: {originX: this.x, originY: this.y - 12.5, rotatedX: this.x, rotatedY: this.y - 12.5},
            left: {originX: this.x - 20, originY: this.y + 12.5, rotatedX: this.x - 20, rotatedY: this.y + 12.5},
            right: {originX: this.x + 20, originY: this.y + 12.5, rotatedX: this.x + 20, rotatedY: this.y + 12.5}
        }
        this.color = color
        this.bServ = bServ
        this.shot_type = shot_type
        this.delay = shot_type.delay
        this.cooldown = 0
        this.angle = 0
        this.isCom = isCom
        this.keyDown = this.keydown.bind(this)
        this.keyUp = this.keyup.bind(this)
    }

    update (canvas) {
        if (this.upPressed && !this.outOfBounds('Y', 'min', canvas)) this.updatePoints('Y', 'negative')

        if (this.leftPressed && !this.outOfBounds('X', 'min', canvas)) this.updatePoints('X', 'negative')

        if (this.downPressed && !this.outOfBounds('Y', 'max', canvas)) this.updatePoints('Y', 'positive')

        if (this.rightPressed && !this.outOfBounds('X', 'max', canvas)) this.updatePoints('X', 'positive')
    }

    updatePoints (ordinate, change) {
        const baseOrd = ordinate.toLowerCase()
        const ord = `origin${ordinate}`

        if (change === 'positive') {
            this[baseOrd] += this.spd
            this.points.top[ord] += this.spd
            this.points.left[ord] += this.spd
            this.points.right[ord] += this.spd
            this.calcRotatedPoints()
        } else {
            this[baseOrd] -= this.spd
            this.points.top[ord] -= this.spd
            this.points.left[ord] -= this.spd
            this.points.right[ord] -= this.spd
            this.calcRotatedPoints()
        }
    }

    calcRotatedPoints () {
        this.calcOrdinate('top')
        this.calcOrdinate('left')
        this.calcOrdinate('right')
    }

    calcOrdinate (point) {
        const p = point
        let x
        let y

        x = ((this.points[p].originX - this.x) * Math.cos(this.angle)) - ((this.points[p].originY - this.y) * Math.sin(this.angle))
        x += this.x

        y = ((this.points[p].originY - this.y) * Math.cos(this.angle)) + ((this.points[p].originX - this.x) * Math.sin(this.angle))
        y += this.y

        this.points[p].rotatedX = x
        this.points[p].rotatedY = y
    }

    outOfBounds (ordinate, minOrMax, canvas) {
        const ord = ordinate
        const type = minOrMax

        if (ord === 'x') {
            if (type === 'min') {
                if (this.points.top.x < 4 || this.points.left.x < 4 || this.points.right.x < 4) {
                    return true
                } else return false
            } else {
                if (this.points.top.x > canvas.width + 4 || this.points.left.x > canvas.width + 4 || this.points.right.x > canvas.width + 4) {
                    return true
                } else return false
            }
        } else if (ord === 'y') {
            if (type === 'min') {
                if (this.points.top.y < 4 || this.points.left.y < 4 || this.points.right.y < 4) {
                    return true
                } else return false
            } else {
                if (this.points.top.y > canvas.height + 4 || this.points.left.y > canvas.height + 4 || this.points.right.y > canvas.height + 4) {
                    return true
                } else return false
            }
        }
    }
    
    render (ctx) {
        if (this.jPressed) {
            this.decreaseAng()
        }
        if (this.kPressed) {
            this.increaseAng()
        }
        if (this.isShooting) this.shoot()

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
        if (this.cooldown === 0) {
            this.calcRotatedPoints()
            this.bServ.createBullet(this.points.top.rotatedX, this.points.top.rotatedY, this.shot_type, this.color, this.angle)

            this.cooldown = this.delay
        } else if (this.isShooting === false) {
            this.cooldown = 0
        } else this.cooldown--
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
                break
            case 'KeyK':
                this.kPressed = true
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