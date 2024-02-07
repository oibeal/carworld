class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.ACCELERATION = .2;
        this.MAX_SPEED = 3;
        this.MAX_REVERSE_SPEED = -this.MAX_SPEED / 2;
        this.FRICTION = .05;
        this.TURN_RATIO = .03;
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

        if (this.speed > this.MAX_SPEED) {
            this.speed = this.MAX_SPEED;
        } else if (this.speed < this.MAX_REVERSE_SPEED) {
            this.speed = this.MAX_REVERSE_SPEED;
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
                this.angle += this.TURN_RATIO * flip;
            }
            if (this.controls.right) {
                this.angle -= this.TURN_RATIO * flip;
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