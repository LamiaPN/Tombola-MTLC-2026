/* ==========================================
   TOMBOLA MTL CONNECTE 2026 - Tirage roue
   Version préchargée + couleurs MTL connecte
   Gagnant tiré une seule fois
   ========================================== */

console.log("[tirage.js] Version roue préchargée - option 2 - 2026-06-12");

document.addEventListener("DOMContentLoaded", () => {
  const drawBtn = document.getElementById("drawBtn");
  const drawDisplay = document.getElementById("drawDisplay");
  const winnerInfo = document.getElementById("winnerInfo");
  const wheelCanvas = document.getElementById("wheelCanvas");

  if (!drawBtn || !wheelCanvas) {
    console.warn("Éléments de tirage manquants : drawBtn ou wheelCanvas.");
    return;
  }

  if (typeof API_URL === "undefined") {
    console.error("API_URL est introuvable. Vérifie que api.js est chargé avant tirage.js.");
    drawBtn.disabled = true;
    return;
  }

  const ctx = wheelCanvas.getContext("2d");

  let participants = [];
  let currentRotation = 0;
  let participantsLoaded = false;
  let isDrawing = false;

  drawPlaceholderWheel();

  drawBtn.disabled = true;
  drawBtn.textContent = "Chargement...";

  if (drawDisplay) {
    drawDisplay.textContent = "Préparation des billets...";
  }

  preloadParticipants(false);

  drawBtn.addEventListener("click", launchDraw);

  async function preloadParticipants(showAlert) {
    drawBtn.disabled = true;
    drawBtn.textContent = "Chargement...";

    if (drawDisplay) {
      drawDisplay.style.display = "block";
      drawDisplay.className = "draw-display waiting";
      drawDisplay.textContent = "Préparation des billets...";
    }

    try {
      const rawParticipants = await fetchParticipantsFromSheet();

      participants = rawParticipants
        .map(normalizeParticipant)
        .filter(participant =>
          participant.ticketNumber ||
          participant.fullName ||
          participant.email
        );

      if (!participants.length) {
        participantsLoaded = false;
        drawPlaceholderWheel();

        if (drawDisplay) {
          drawDisplay.textContent = "Aucun participant";
        }

        drawBtn.disabled = true;
        drawBtn.textContent = "Aucun participant";
        return false;
      }

      participantsLoaded = true;
      currentRotation = 0;

      drawWheel(participants, currentRotation);

      if (drawDisplay) {
        drawDisplay.textContent = "Cliquez sur lancer";
      }

      drawBtn.disabled = false;
      drawBtn.textContent = "Lancer le tirage";

      return true;

    } catch (error) {
      console.error("Erreur chargement participants pour le tirage :", error);

      participantsLoaded = false;
      drawPlaceholderWheel();

      if (drawDisplay) {
        drawDisplay.textContent = "Erreur de chargement";
      }

      drawBtn.disabled = false;
      drawBtn.textContent = "Réessayer";

      if (showAlert) {
        alert("Impossible de charger les participants depuis le Google Sheet.");
      }

      return false;
    }
  }

  async function fetchParticipantsFromSheet() {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Réponse serveur invalide : " + response.status);
    }

    const data = await response.json();

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
    if (isDrawing) {
      return;
    }

    if (!participantsLoaded) {
      const loaded = await preloadParticipants(true);

      if (!loaded) {
        return;
      }
    }

    if (!participants.length) {
      alert("Aucun participant disponible pour le tirage.");
      return;
    }

    isDrawing = true;

    drawBtn.disabled = true;
    drawBtn.textContent = "Tirage en cours...";

    winnerInfo.innerHTML = "";

    if (drawDisplay) {
      drawDisplay.style.display = "block";
      drawDisplay.className = "draw-display drawing";
      drawDisplay.textContent = "Tirage en cours...";
    }

    /*
      IMPORTANT :
      Le gagnant est tiré UNE SEULE FOIS ici.
      La roue s'arrête ensuite sur ce même gagnant.
    */
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    animateWheelToWinner(winnerIndex, winner);
  }

  function animateWheelToWinner(winnerIndex, winner) {
    const total = participants.length;
    const sliceAngle = (Math.PI * 2) / total;
    const pointerAngle = -Math.PI / 2;

    const winnerCenterAngle =
      winnerIndex * sliceAngle + sliceAngle / 2;

    const desiredRotation =
      normalizeAngle(pointerAngle - winnerCenterAngle);

    const currentNormalized =
      normalizeAngle(currentRotation);

    let delta =
      desiredRotation - currentNormalized;

    if (delta < 0) {
      delta += Math.PI * 2;
    }

    const fullSpins = 7 * Math.PI * 2;
    const rotationDistance = fullSpins + delta;
    const startRotation = currentRotation;
    const targetRotation = startRotation + rotationDistance;

    const duration = 5200;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      currentRotation =
        startRotation + rotationDistance * easedProgress;

      drawWheel(participants, currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      currentRotation = targetRotation;
      drawWheel(participants, currentRotation);

      setTimeout(() => {
        displayWinner(winner);

        drawBtn.disabled = false;
        drawBtn.textContent = "Relancer le tirage";

        isDrawing = false;
      }, 650);
    }

    requestAnimationFrame(animate);
  }

  function drawWheel(data, rotation) {
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 26;
    const innerRadius = 78;

    ctx.clearRect(0, 0, size, size);

    if (!data.length) {
      drawPlaceholderWheel();
      return;
    }

    const sliceAngle = (Math.PI * 2) / data.length;
    const wheelColors = ["#0b0b0b", "#67bf43"];

    data.forEach((participant, index) => {
      const startAngle = rotation + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const segmentColor = wheelColors[index % wheelColors.length];

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = segmentColor;
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      drawTicketLabel(
        participant.ticketNumber,
        startAngle + sliceAngle / 2,
        radius,
        innerRadius,
        data.length
      );
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 16;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f7f8";
    ctx.fill();
  }

  function drawPlaceholderWheel() {
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 26;
    const innerRadius = 78;
    const total = 12;
    const sliceAngle = (Math.PI * 2) / total;
    const wheelColors = ["#0b0b0b", "#67bf43"];

    ctx.clearRect(0, 0, size, size);

    for (let index = 0; index < total; index++) {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const segmentColor = wheelColors[index % wheelColors.length];

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = segmentColor;
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 16;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f7f8";
    ctx.fill();
  }

  function drawTicketLabel(label, angle, radius, innerRadius, total) {
    const size = wheelCanvas.width;
    const center = size / 2;

    const textRadius =
      innerRadius + (radius - innerRadius) * 0.58;

    const x = center + Math.cos(angle) * textRadius;
    const y = center + Math.sin(angle) * textRadius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (Math.cos(angle) < 0) {
      ctx.rotate(Math.PI);
    }

    const fontSize = getFontSize(total);

    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(String(label || ""), 0, 0);

    ctx.restore();
  }

  function getFontSize(total) {
    if (total <= 8) return 30;
    if (total <= 14) return 24;
    if (total <= 24) return 18;
    if (total <= 40) return 14;
    return 11;
  }

  function displayWinner(winner) {
    if (drawDisplay) {
      drawDisplay.style.display = "none";
    }

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

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function normalizeAngle(angle) {
    const fullCircle = Math.PI * 2;
    return ((angle % fullCircle) + fullCircle) % fullCircle;
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
