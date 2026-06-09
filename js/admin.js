const tableBody =
    document.getElementById(
        "participantsTable"
    );

const participantCount =
    document.getElementById(
        "participantCount"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

let participants = [];

loadParticipants();

async function loadParticipants() {

    try {

        tableBody.innerHTML =
            `<tr><td colspan="4">Chargement...</td></tr>`;

        const response =
            await fetch(API_URL);

        participants =
            await response.json();

        renderTable(participants);

    }

    catch (error) {

        console.error(error);

        tableBody.innerHTML =
            `<tr><td colspan="4">Erreur de chargement.</td></tr>`;

    }

}

function renderTable(data){

    tableBody.innerHTML = "";

    participantCount.textContent =
        data.length;

    data.forEach(participant => {

        tableBody.innerHTML += `

            <tr>

             <td>
    ${escapeHtml(participant.ticketNumber)}
</td>

<td>
    ${escapeHtml(participant.firstName)}
    ${escapeHtml(participant.lastName)}
</td>

<td>
    ${escapeHtml(participant.company)}
</td>

<td>
    ${escapeHtml(participant.email)}
</td>
            </tr>

        `;

    });

}

searchInput.addEventListener(
    "input",
    function(){

        const search =
            this.value.toLowerCase();

        const filtered =
            participants.filter(p =>

                p.firstName.toLowerCase().includes(search) ||

                p.lastName.toLowerCase().includes(search) ||

                p.company.toLowerCase().includes(search) ||

                p.email.toLowerCase().includes(search)

            );

        renderTable(filtered);

    }
);

document
.getElementById("exportCsvBtn")
.addEventListener("click", exportCSV);

function exportCSV(){

    let csv =
        "Numero;Nom;Entreprise;Courriel\n";

    participants.forEach(p => {

        csv +=
        `${p.ticketNumber};${p.firstName} ${p.lastName};${p.company};${p.email}\n`;

    });

    const BOM = "\uFEFF";

const blob =
    new Blob([BOM + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "participants_tombola.csv";

    a.click();

}

document
.getElementById("refreshBtn")
.addEventListener(
    "click",
    loadParticipants
);

    const confirmReset =
        confirm(
            "Supprimer toutes les participations ?"
        );

    if(!confirmReset) return;

    localStorage.removeItem(
        APP_CONFIG.localStorageKey
    );

    location.reload();

});
