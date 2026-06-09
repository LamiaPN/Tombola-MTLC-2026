let selectedSize = "";
let selectedSector = "";

document
.querySelectorAll("#sizeGroup .chip")
.forEach(button => {

    button.addEventListener("click", () => {

        document
        .querySelectorAll("#sizeGroup .chip")
        .forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        selectedSize = button.textContent.trim();

        document
        .getElementById("size")
        .value = selectedSize;

    });

});

document
.querySelectorAll("#sectorGroup .chip")
.forEach(button => {

    button.addEventListener("click", () => {

        document
        .querySelectorAll("#sectorGroup .chip")
        .forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        selectedSector = button.textContent.trim();

        document
        .getElementById("sector")
        .value = selectedSector;

    });

});

const form =
    document.getElementById(
        "participantForm"
    );

const confirmation =
    document.getElementById(
        "confirmation"
    );

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const company =
            document.getElementById("company").value.trim();

        const size =
            document.getElementById("size").value
                .replace(/\s+/g, " ")
                .trim();

        const sector =
            document.getElementById("sector").value
                .replace(/\s+/g, " ")
                .trim();

        if (!size) {

            confirmation.innerHTML =
                `<div class="error-message">Veuillez sélectionner une taille d'organisation.</div>`;

            return;

        }

        if (!sector) {

            confirmation.innerHTML =
                `<div class="error-message">Veuillez sélectionner un secteur d'activité.</div>`;

            return;

        }

        const participant = {

            firstName,
            lastName,
            email,
            company,
            sector,
            size

        };

        try {

            const response =

            console.log("API =", API_URL);

console.log("ENVOI APPS SCRIPT");
console.log(participant);
const response =
    await fetch(API_URL, {
                await fetch(API_URL, {

                    method: "POST",

                    body: JSON.stringify(
                        participant
                    )

                });
console.log("REPONSE RECUE");
            const result =
                await response.json();

            if (!result.success) {

                confirmation.innerHTML =
                    `<div class="error-message">Erreur lors de l'inscription.</div>`;

                return;

            }

            participant.ticketNumber =
                result.ticketNumber;

            localStorage.setItem(
                "lastParticipant",
                JSON.stringify(participant)
            );

            window.location.href =
                "confirmation.html";

        }

        catch (error) {

            console.error(error);

            confirmation.innerHTML =
                `<div class="error-message">Impossible de joindre le serveur.</div>`;

        }

    }
);
