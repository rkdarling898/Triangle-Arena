export class Bullet_Service {
    constructor (canvas) {
        this.bullets = []
        this.canvas = canvas
        this.shot_types = {
            basic: {
                size: 4,
                spd: 10,
                delay: 16,
                damage: 3
            },
            
            blaster: {
                size: 14,
                spd: 8,
                delay: 30,
                damage: 7
            },
        
            laser: {
                size: 1,
                spd: 10,
                delay: 0,
                damage: 1
            }
        }
    }

    createBullet (x, y, shot_type, color, angle) {
        this.bullets.push(new Bullet(x, y, shot_type, color, angle))
    }

    deleteBullet (bullet) {
        this.bullets.splice(bullet, 1)
    }
    
    update () {
        this.bullets.forEach((bullet) => {
            bullet.update()
        })
    }

    render (ctx) {
        this.bullets.forEach((bullet) => {
            if (this.offScreen(bullet)) {
                this.deleteBullet(bullet)
            } else bullet.render(ctx)
        })
    }

    offScreen (bullet) {
        if (bullet.x < -4 || bullet.x > this.canvas.width + 4 || 
            bullet.y < -4 || bullet.y > this.canvas.height) {
            return true
        } else {
            return false
        }
    }
}

export class Bullet {
    constructor (x, y, shot_type, color, angle) {
        this.x = x
        this.y = y
        this.size = shot_type.size
        this.spd = shot_type.spd
        this.damage = shot_type.damage
        this.color = color
        this.angle = angle
    }

    update () {
        this.x += Math.cos(this.angle - (Math.PI/2)) * this.spd
        this.y += Math.sin(this.angle - (Math.PI/2)) * this.spd
    }

    render (ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        // console.log('bullets working')
    }
}