class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.ACCELERATION = .2;
        this.MAXSPEED = 3;
        this.MAXREVERSESPEED = -this.MAXSPEED / 2;
        this.FRICTION = .05;
        this.TURNRATIO = .03;
        this.speed = 0;
        this.angle = 0;

        this.controls = new Controls();
    }

    update() {
        this.#move();
    }

    #move() {
        // Speed control
        if (this.controls.forward) {
            this.speed += this.ACCELERATION;
        }
        if (this.controls.reverse) {
            this.speed -= this.ACCELERATION;
        }

        if (this.speed > this.MAXSPEED) {
            this.speed = this.MAXSPEED;
        } else if (this.speed < this.MAXREVERSESPEED) {
            this.speed = this.MAXREVERSESPEED;
        }

        if (this.speed > 0) {
            this.speed -= this.FRICTION;
        } else if (this.speed < 0) {
            this.speed += this.FRICTION;
        }

        if (Math.abs(this.speed) < this.FRICTION) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            // Turn control
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += this.TURNRATIO * flip;
            }
            if (this.controls.right) {
                this.angle -= this.TURNRATIO * flip;
            }
        }

        // Position asignation
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        const posX = -this.width / 2;
        const posY = -this.height / 2;
        ctx.beginPath();
        ctx.rect(posX, posY, this.width, this.height);
        ctx.fill();

        ctx.restore();
    }
}