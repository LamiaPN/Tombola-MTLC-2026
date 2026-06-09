/* ==========================================
   TOMBOLA MTL CONNECTE 2026 - Console admin
   Lit les participants depuis Google Sheets
   via l'API Apps Script (doGet)
   ========================================== */

console.log("[admin.js] Version Google Sheets chargée - 2026-06-09");

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("participantsTable");
  const participantCount = document.getElementById("participantCount");
  const searchInput = document.getElementById("searchInput");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  let participants = [];

  /* Sécurité : vérifie que les éléments HTML essentiels existent */
  if (!tableBody || !participantCount) {
    console.error("Éléments HTML manquants : participantsTable ou participantCount");
    return;
  }

  /* Sécurité : vérifie que l'URL API est disponible */
  if (typeof API_URL === "undefined") {
    console.error("API_URL est introuvable. Vérifie que api.js est chargé avant admin.js.");

    tableBody.innerHTML = `
      <tr>
        <td colspan="4">Erreur : API_URL introuvable. Vérifie api.js.</td>
      </tr>
    `;

    participantCount.textContent = "0";
    return;
  }

  /* Récupère les participants depuis Google Sheets */
  async function fetchParticipants() {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Réponse serveur invalide : " + response.status);
    }

    const data = await response.json();

    console.log("Réponse API reçue :", data);

    /* Cas 1 : l'API retourne directement un tableau */
    if (Array.isArray(data)) {
      return data;
    }

    /* Cas 2 : l'API retourne { participants: [...] } */
    if (data && Array.isArray(data.participants)) {
      return data.participants;
    }

    /* Cas 3 : format inattendu */
    console.error("Format API inattendu :", data);
    return [];
  }

  /* Charge ou recharge la liste */
  async function loadParticipants() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">Chargement en cours...</td>
      </tr>
    `;

    participantCount.textContent = "...";

    try {
      participants = await fetchParticipants();
      renderTable(participants);
    } catch (error) {
      console.error("Erreur chargement participants :", error);

      tableBody.innerHTML = `
        <tr>
          <td colspan="4">
            Impossible de charger les participants. Vérifie la connexion puis clique sur Actualiser.
          </td>
        </tr>
      `;

      participantCount.textContent = "0";
    }
  }

  /* Affiche les participants dans le tableau */
  function renderTable(data) {
    tableBody.innerHTML = "";
    participantCount.textContent = data.length;

    if (!data.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">Aucun participant trouvé.</td>
        </tr>
      `;
      return;
    }

    data.forEach((participant) => {
      const normalized = normalizeParticipant(participant);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${escapeHtml(normalized.ticketNumber)}</td>
        <td>${escapeHtml(normalized.fullName)}</td>
        <td>${escapeHtml(normalized.company)}</td>
        <td>${escapeHtml(normalized.email)}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  /* Normalise les noms de champs possibles */
  function normalizeParticipant(participant) {
    const ticketNumber =
      participant.ticketNumber ||
      participant.numero ||
      participant.numéro ||
      participant.Numero ||
      participant.Numéro ||
      "";

    const firstName =
      participant.firstName ||
      participant.prenom ||
      participant.prénom ||
      participant.Prenom ||
      participant.Prénom ||
      "";

    const lastName =
      participant.lastName ||
      participant.nom ||
      participant.Nom ||
      "";

    const fullName =
      participant.fullName ||
      participant.name ||
      participant.nomComplet ||
      `${firstName} ${lastName}`.trim();

    const company =
      participant.company ||
      participant.entreprise ||
      participant.Entreprise ||
      "";

    const email =
      participant.email ||
      participant.courriel ||
      participant.Courriel ||
      participant.mail ||
      "";

    return {
      ticketNumber,
      firstName,
      lastName,
      fullName,
      company,
      email
    };
  }

  /* Recherche */
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const search = this.value.toLowerCase();

      const filtered = participants.filter((participant) => {
        const p = normalizeParticipant(participant);

        return (
          String(p.ticketNumber).toLowerCase().includes(search) ||
          String(p.fullName).toLowerCase().includes(search) ||
          String(p.company).toLowerCase().includes(search) ||
          String(p.email).toLowerCase().includes(search)
        );
      });

      renderTable(filtered);
    });
  }

  /* Export CSV */
  function exportCSV() {
    let csv = "Numero;Nom;Entreprise;Courriel\n";

    participants.forEach((participant) => {
      const p = normalizeParticipant(participant);

      const line = [
        p.ticketNumber,
        p.fullName,
        p.company,
        p.email
      ].map(csvEscape).join(";");

      csv += line + "\n";
    });

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "participants_tombola.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", exportCSV);
  }

  /* Bouton Actualiser */
  if (refreshBtn) {
    refreshBtn.addEventListener("click", loadParticipants);
  }

  /* Protection CSV */
  function csvEscape(value) {
    const text = String(value || "").replace(/"/g, '""');
    return `"${text}"`;
  }

  /* Protection HTML */
  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* Chargement initial */
  loadParticipants();
});
