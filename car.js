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
        this.damaged = false;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders) {
        if (this.damaged) {
            return
        }

        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders);
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        // Front right corner
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        // Front left corner
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        // Back left corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        // Back right corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
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
        ctx.fillStyle = this.damaged ? "maroon" : "black";
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        this.polygon.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.fill();

        this.sensor.draw(ctx);
    }
}