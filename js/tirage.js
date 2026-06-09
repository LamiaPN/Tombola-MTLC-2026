/* ==========================================
   TOMBOLA MTL CONNECTE 2026 - Tirage
   Lit les participants depuis Google Sheets
   via l'API Apps Script
   Gagnant tiré une seule fois
   ========================================== */

console.log("[tirage.js] Version Google Sheets corrigée - tirage unique - 2026-06-09");

document.addEventListener("DOMContentLoaded", () => {
  const drawBtn = document.getElementById("drawBtn");
  const drawDisplay = document.getElementById("drawDisplay");
  const winnerInfo = document.getElementById("winnerInfo");

  if (!drawBtn) {
    console.warn("Bouton drawBtn introuvable sur cette page.");
    return;
  }

  if (typeof API_URL === "undefined") {
    console.error("API_URL est introuvable. Vérifie que api.js est chargé avant tirage.js.");
    drawBtn.disabled = true;
    return;
  }

  drawBtn.addEventListener("click", launchDraw);

  async function fetchParticipantsFromSheet() {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Réponse serveur invalide : " + response.status);
    }

    const data = await response.json();

    console.log("Participants reçus pour le tirage :", data);

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.participants)) {
      return data.participants;
    }

    console.error("Format API inattendu :", data);
    return [];
  }

  async function launchDraw() {
    if (!drawDisplay || !winnerInfo) {
      alert("Zone de tirage introuvable dans la page.");
      return;
    }

    drawBtn.disabled = true;
    drawBtn.textContent = "Chargement...";

    winnerInfo.innerHTML = "";

    drawDisplay.style.display = "block";
    drawDisplay.className = "draw-display drawing";
    drawDisplay.textContent = "...";

    showLogo();

    let participants = [];

    try {
      participants = await fetchParticipantsFromSheet();
      participants = participants
        .map(normalizeParticipant)
        .filter(participant =>
          participant.ticketNumber ||
          participant.fullName ||
          participant.email
        );
    } catch (error) {
      console.error("Erreur chargement participants pour le tirage :", error);
      alert("Impossible de charger les participants depuis le Google Sheet.");
      drawBtn.disabled = false;
      drawBtn.textContent = "Lancer le tirage";
      drawDisplay.textContent = "";
      return;
    }

    if (participants.length === 0) {
      alert("Aucun participant disponible pour le tirage.");
      drawBtn.disabled = false;
      drawBtn.textContent = "Lancer le tirage";
      drawDisplay.textContent = "";
      return;
    }

    drawBtn.textContent = "Tirage en cours...";

    /*
      IMPORTANT :
      Le gagnant est tiré UNE SEULE FOIS ici.
      L'animation doit s'arrêter sur ce même gagnant.
    */
    const winner =
      participants[Math.floor(Math.random() * participants.length)];

    let speed = 50;
    let cycles = 0;

    function spin() {
      const randomParticipant =
        participants[Math.floor(Math.random() * participants.length)];

      drawDisplay.textContent = randomParticipant.ticketNumber;

      cycles++;

      if (cycles > 35) {
        speed += 12;
      }

      if (cycles > 55) {
        speed += 18;
      }

      if (cycles > 70) {
        speed += 25;
      }

      if (cycles >= 80) {
        /*
          L'écran s'arrête sur le vrai gagnant.
          Pas de deuxième tirage ici.
        */
        drawDisplay.textContent = winner.ticketNumber;

        displayWinner(winner);

        drawBtn.disabled = false;
        drawBtn.textContent = "Relancer le tirage";

        console.log("Gagnant tiré :", winner);

        return;
      }

      setTimeout(spin, speed);
    }

    spin();
  }

  function displayWinner(winner) {
    drawDisplay.style.display = "none";

    hideLogo();

    winnerInfo.innerHTML = `
      <h2>🎉 GAGNANT 🎉</h2>

      <div class="winner-name">
        ${escapeHtml(winner.fullName)}
      </div>

      <div class="winner-company">
        ${escapeHtml(winner.company)}
      </div>

      <div class="winner-ticket">
        ${escapeHtml(winner.ticketNumber)}
      </div>
    `;

    launchConfetti();
  }

  function normalizeParticipant(participant) {
    const ticketNumber =
      participant.ticketNumber ||
      participant.numero ||
      participant.numéro ||
      participant.Numero ||
      participant.Numéro ||
      participant["Numéro"] ||
      "";

    const firstName =
      participant.firstName ||
      participant.prenom ||
      participant.prénom ||
      participant.Prenom ||
      participant.Prénom ||
      participant["Prénom"] ||
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
      participant["Nom complet"] ||
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

  function showLogo() {
    const logoContainer = document.querySelector(".tirage-logo-container");
    const logo = document.querySelector(".tirage-logo");

    if (logoContainer) {
      logoContainer.style.display = "block";
    }

    if (logo) {
      logo.style.display = "block";
    }
  }

  function hideLogo() {
    const logoContainer = document.querySelector(".tirage-logo-container");
    const logo = document.querySelector(".tirage-logo");

    if (logoContainer) {
      logoContainer.style.display = "none";
    }

    if (logo) {
      logo.style.display = "none";
    }
  }

  function launchConfetti() {
    if (typeof confetti === "undefined") {
      console.warn("Librairie confetti introuvable.");
      return;
    }

    const duration = 8000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 100
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

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

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
