const drawBtn =
    document.getElementById("drawBtn");

const drawDisplay =
    document.getElementById("drawDisplay");

const winnerInfo =
    document.getElementById("winnerInfo");

drawBtn.addEventListener(
    "click",
    launchDraw
);

function launchDraw(){

    const participants =
        getParticipants();

    if(participants.length === 0){

        alert("Aucun participant.");

        return;
    }

    drawBtn.disabled = true;

    winnerInfo.innerHTML = "";
    drawDisplay.className =
    "draw-display drawing";

    let speed = 50;

    let cycles = 0;

    function spin(){

        const randomParticipant =

            participants[
                Math.floor(
                    Math.random()
                    * participants.length
                )
            ];

        drawDisplay.textContent =
            randomParticipant.ticketNumber;

        cycles++;

        if(cycles > 35){

            speed += 12;
        }

        if(cycles > 55){

            speed += 18;
        }

        if(cycles > 70){

            speed += 25;
        }

        if(cycles >= 80){

            const winner =

                participants[
                    Math.floor(
                        Math.random()
                        * participants.length
                    )
                ];

            displayWinner(winner);

            return;
        }

        setTimeout(spin, speed);

    }

    spin();

}

function displayWinner(winner) {

    // Cache le numéro qui défile
    drawDisplay.style.display = "none";

    // Cache le logo Printemps Numérique
    const logo = document.querySelector(
        ".tirage-logo-container"
    );

    if (logo) {

        logo.style.display = "none";

    }

    // Affiche le gagnant
    winnerInfo.innerHTML = `

        <h2>🎉 GAGNANT 🎉</h2>

        <div class="winner-name">
            ${escapeHtml(winner.firstName)}
            ${escapeHtml(winner.lastName)}
        </div>

        <div class="winner-company">
            ${escapeHtml(winner.company)}
        </div>

        <div class="winner-ticket">
            ${escapeHtml(winner.ticketNumber)}
        </div>

    `;

    // Confettis
    const duration = 8000;

    const animationEnd =
        Date.now() + duration;

    const defaults = {

        startVelocity: 30,

        spread: 360,

        ticks: 100

    };

    function randomInRange(min, max) {

        return Math.random() *
            (max - min) + min;

    }

    const interval = setInterval(function () {

        const timeLeft =
            animationEnd - Date.now();

        if (timeLeft <= 0) {

            clearInterval(interval);

            return;

        }

        const particleCount =
            50 * (timeLeft / duration);

        confetti({

            ...defaults,

            particleCount,

            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            }

        });

        confetti({

            ...defaults,

            particleCount,

            origin: {
                x: randomInRange(0.7, 0.9),
                y: Math.random() - 0.2
            }

        });

    }, 250);

}
