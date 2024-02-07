class Controls {
    constructor() {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        document.onkeydown = (evt) => {
            switch (evt.key) {
                case "a":
                case "A":
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    this.right = true;
                    break;
                case "w":
                case "W":
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        };

        document.onkeyup = (evt) => {
            switch (evt.key) {
                case "a":
                case "A":
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    this.right = false;
                    break;
                case "w":
                case "W":
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        };
    }
}