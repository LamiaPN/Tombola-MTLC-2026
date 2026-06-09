/* ==========================================
   TOMBOLA MTL CONNECTE 2026
   Gestion du stockage local (localStorage)
   ========================================== */

/* Securise l'affichage du texte contre les injections HTML (XSS) */
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* Recupere tous les participants depuis le localStorage */
function getParticipants() {
    return JSON.parse(
        localStorage.getItem(APP_CONFIG.localStorageKey)
    ) || [];
}

/* Sauvegarde la liste complete des participants */
function saveParticipants(participants) {
    localStorage.setItem(
        APP_CONFIG.localStorageKey,
        JSON.stringify(participants)
    );
}

/* Genere le prochain numero de billet disponible.
   Robuste aux suppressions : se base sur le plus grand
   numero existant + 1, jamais sur participants.length.
   Exemple : T-0001, T-0002, T-0003 */
function generateTicketNumber() {
    const participants = getParticipants();

    const maxNumber = participants.reduce((max, participant) => {
        const currentNumber = parseInt(
            (participant.ticketNumber || "").replace(/\D/g, ""),
            10
        ) || 0;
        return currentNumber > max ? currentNumber : max;
    }, 0);

    const nextNumber = maxNumber + 1;
    return `${APP_CONFIG.ticketPrefix}-${String(nextNumber).padStart(4, "0")}`;
}

/* Verifie si une adresse courriel existe deja */
function emailExists(email) {
    if (APP_CONFIG.allowDuplicateEmails) {
        return false;
    }

    const participants = getParticipants();
    return participants.some(participant =>
        participant.email.toLowerCase() === email.toLowerCase()
    );
}

/* Ajoute un participant a la liste */
function addParticipant(data) {
    const participants = getParticipants();
    participants.push(data);
    saveParticipants(participants);
}
