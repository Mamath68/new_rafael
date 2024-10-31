document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const squares = [];
    const SETTINGS = {
        maxCollisions: 4,
        initialSquares: 5,
        minSize: 10,
        initialSize: 50,
        shrinkFactor: 0.75,
        speedRange: { min: -3, max: 3 },
        clickOffset: 25 // Moitié de la taille initiale pour centrage
    };

    class Square {
        constructor(x, y, dx, dy) {
            this.element = document.createElement('div');
            this.element.classList.add('carre');
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.width = SETTINGS.initialSize;
            this.height = SETTINGS.initialSize;
            this.collisions = 0;
            this.updateElementPosition();
            container.appendChild(this.element);
        }

        updateElementPosition() {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
        }

        move() {
            this.x += this.dx;
            this.y += this.dy;

            // Rebonds sur les bords
            if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
                this.dx *= -1;
                this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
            }
            if (this.y <= 0 || this.y + this.height >= window.innerHeight) {
                this.dy *= -1;
                this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));
            }

            this.updateElementPosition();
        }

        shrink() {
            this.collisions++;
            this.width = Math.max(SETTINGS.minSize, this.width * SETTINGS.shrinkFactor);
            this.height = Math.max(SETTINGS.minSize, this.height * SETTINGS.shrinkFactor);
        }
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createSquare(x, y) {
        const dx = randomBetween(SETTINGS.speedRange.min, SETTINGS.speedRange.max);
        const dy = randomBetween(SETTINGS.speedRange.min, SETTINGS.speedRange.max);
        return new Square(x, y, dx, dy);
    }

    function detectCollision(square1, square2) {
        return square1.x < square2.x + square2.width &&
               square1.x + square1.width > square2.x &&
               square1.y < square2.y + square2.height &&
               square1.y + square1.height > square2.y;
    }

    function handleCollision(square1, square2) {
        // Échange des vélocités
        [square1.dx, square2.dx] = [square2.dx, square1.dx];
        [square1.dy, square2.dy] = [square2.dy, square1.dy];

        // Rétrécissement
        square1.shrink();
        square2.shrink();
    }

    function moveSquares() {
        squares.forEach((square, i) => {
            square.move();

            // Vérification des collisions
            for (let j = i + 1; j < squares.length; j++) {
                if (detectCollision(square, squares[j])) {
                    handleCollision(square, squares[j]);
                }
            }
        });

        // Suppression des carrés trop "usés"
        for (let i = squares.length - 1; i >= 0; i--) {
            if (squares[i].collisions >= SETTINGS.maxCollisions) {
                squares[i].element.remove();
                squares.splice(i, 1);
            }
        }

        requestAnimationFrame(moveSquares);
    }

    // Initialisation
    for (let i = 0; i < SETTINGS.initialSquares; i++) {
        const x = randomBetween(0, window.innerWidth - SETTINGS.initialSize);
        const y = randomBetween(0, window.innerHeight - SETTINGS.initialSize);
        squares.push(createSquare(x, y));
    }

    // Gestionnaire d'événements
    window.addEventListener('click', (e) => {
        // Changement aléatoire de direction pour les carrés existants
        squares.forEach(square => {
            square.dx = randomBetween(SETTINGS.speedRange.min, SETTINGS.speedRange.max);
            square.dy = randomBetween(SETTINGS.speedRange.min, SETTINGS.speedRange.max);
        });

        // Création d'un nouveau carré au point de clic
        squares.push(createSquare(
            e.clientX - SETTINGS.clickOffset,
            e.clientY - SETTINGS.clickOffset
        ));
    });

    moveSquares();
});