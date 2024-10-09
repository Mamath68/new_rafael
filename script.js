document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const squares = [];
    const maxCollisions = 4;

    function createSquare(x, y, dx, dy) {
        const carre = document.createElement('div');
        carre.classList.add('carre');
        carre.style.left = `${x}px`;
        carre.style.top = `${y}px`;
        carre.style.width = `50px`;
        carre.style.height = `50px`;
        container.appendChild(carre);

        return {
            element: carre,
            x,
            y,
            dx,
            dy,
            width: 50,
            height: 50,
            collisions: 0
        };
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function moveSquares() {
        squares.forEach((square, i) => {
            square.x += square.dx;
            square.y += square.dy;

            // Rebondir sur les bords de la fenêtre
            if (square.x <= 0 || square.x + square.width >= window.innerWidth) {
                square.dx *= -1;
            }
            if (square.y <= 0 || square.y + square.height >= window.innerHeight) {
                square.dy *= -1;
            }

            // Vérification des collisions entre carrés
            for (let j = i + 1; j < squares.length; j++) {
                let otherSquare = squares[j];
                if (detectCollision(square, otherSquare)) {
                    handleCollision(square, otherSquare);
                }
            }

            // Mettre à jour la position et la taille du carré
            square.element.style.left = `${square.x}px`;
            square.element.style.top = `${square.y}px`;
            square.element.style.width = `${square.width}px`;
            square.element.style.height = `${square.height}px`;
        });

        // Supprimer les carrés ayant atteint le nombre max de collisions
        for (let i = squares.length - 1; i >= 0; i--) {
            if (squares[i].collisions >= maxCollisions) {
                container.removeChild(squares[i].element);
                squares.splice(i, 1);
            }
        }

        requestAnimationFrame(moveSquares);
    }

    // Détection de collision simple
    function detectCollision(square1, square2) {
        return square1.x < square2.x + square2.width &&
            square1.x + square1.width > square2.x &&
            square1.y < square2.y + square2.height &&
            square1.y + square1.height > square2.y;
    }

    // Gestion des collisions entre deux carrés
    function handleCollision(square1, square2) {
        // Inverser les directions en cas de collision
        let tempDx = square1.dx;
        let tempDy = square1.dy;
        square1.dx = square2.dx;
        square1.dy = square2.dy;
        square2.dx = tempDx;
        square2.dy = tempDy;

        // Augmenter le nombre de collisions et diminuer la taille
        square1.collisions++;
        square2.collisions++;
        square1.width = Math.max(10, square1.width * 0.75);
        square1.height = Math.max(10, square1.height * 0.75);
        square2.width = Math.max(10, square2.width * 0.75);
        square2.height = Math.max(10, square2.height * 0.75);
    }

    // Créer quelques carrés initiaux
    for (let i = 0; i < 5; i++) {
        const x = randomBetween(0, window.innerWidth - 50);
        const y = randomBetween(0, window.innerHeight - 50);
        const dx = randomBetween(-3, 3);
        const dy = randomBetween(-3, 3);
        squares.push(createSquare(x, y, dx, dy));
    }

    // Déplacer les carrés
    moveSquares();

    // Changer de direction et créer un nouveau carré au clic
    window.addEventListener('click', (e) => {
        squares.forEach(square => {
            square.dx = randomBetween(-3, 3);
            square.dy = randomBetween(-3, 3);
        });

        // Ajouter un nouveau carré à chaque clic
        const x = e.clientX - 25; // Ajuster pour centrer le carré
        const y = e.clientY - 25;
        const dx = randomBetween(-3, 3);
        const dy = randomBetween(-3, 3);
        squares.push(createSquare(x, y, dx, dy));
    });
});
