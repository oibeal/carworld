class Car {
    constructor(x, y, width, height, controlType = "DUMMY", color = "black", maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.ACCELERATION = .2;
        this.maxSpeed = maxSpeed;
        this.MAX_REVERSE_SPEED = -this.maxSpeed / 2;
        this.FRICTION = .05;
        this.TURN_RATIO = .03;
        this.speed = 0;
        this.angle = 0;
        this.damaged = false;
        this.color = color;

        this.useBrain = controlType == "AI";
        this.sensor = null;
        this.brain = null;
        if (controlType !== "DUMMY") {
            // TODO: Make sensored car or dummy sensor class
            this.sensor = new Sensor(this);
            // 3 layers input:
            // input: number of trays, hidden: 6, output: number of actions (4)
            const layers = [this.sensor.rayCount, 6, 4];
            this.brain = new NeuralNetwork(layers);
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (this.damaged) {
            return
        }

        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders, traffic);
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                // 1 - offset because want higher values when obstacle is near
                s => s === null ? 0 : 1 - s.offset
            );

            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
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

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
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
        ctx.fillStyle = this.damaged ? "maroon" : this.color;
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        this.polygon.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}