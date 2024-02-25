class Traffic {
    constructor(road) {
        this.STEP = 200;
        this.road = road;
        this.cars = [
            new Car(this.road.getLaneCenter(1), -100, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(0), -300, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(2), -300, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(0), -500, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(1), -500, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(1), -700, 30, 50, "DUMMY", getRandomColor(), 2),
            new Car(this.road.getLaneCenter(2), -700, 30, 50, "DUMMY", getRandomColor(), 2),
        ];
        this.lastLevel = -700;
        this.nextEmpty = false;
    }

    update(roadBorders, bestCarPos, height) {
        // Getting position of the top cars in the road
        this.lastLevel = this.cars.at(-1)?.y ?? this.lastLevel;

        // Remove not visible cars
        this.cars = this.cars.filter(
            car => car.distanceFrom(bestCarPos) < height
        );

        let lastLevel = this.lastLevel;
        if (this.nextEmpty) {
            lastLevel -= 200;
        }

        const distanceFormLastLevel = lastLevel - bestCarPos;
        if (distanceFormLastLevel > -height) {
            this.#addLevel();
        }

        this.cars.forEach(car => car.update(roadBorders, []));
    }

    #addLevel() {
        const numCars = Math.floor(Math.random() * this.road.laneCount);
        const lines = [0, 1, 2];
        let nextLevel = this.lastLevel - this.STEP;
        if (this.nextEmpty) {
            nextLevel -= this.STEP;
        }
        for (let i = 0; i < numCars; i++) {
            const lineIdx = Math.floor(Math.random() * lines.length);
            const line = lines.splice(lineIdx, 1)[0];
            this.cars.push(
                new Car(this.road.getLaneCenter(line), nextLevel, 30, 50, "DUMMY", getRandomColor(), 2),
            );
        }
        this.nextEmpty = numCars === 0;
    }

    draw(ctx) {
        this.cars.forEach(car => car.draw(ctx));
    }
}