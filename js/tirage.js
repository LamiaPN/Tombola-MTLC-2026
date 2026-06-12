/* ==========================
TIRAGE
========================== */

.tirage-logo-container{

    width:100%;

    display:flex;

    justify-content:center;

    align-items:center;

    margin-bottom:20px;

}

.tirage-logo{

    width:220px;

}

.tirage-card{

    background:white;

    border-radius:24px;

    padding:30px 50px;

    text-align:center;

    width:100%;

    max-width:900px;

    box-shadow:0 15px 40px rgba(0,0,0,.08);

}

.draw-display{

    font-weight:800;

    transition:all .3s ease;

    margin:20px 0;

}

.draw-display.waiting{

    font-size:70px;

    color:#6DBE45;

}

.draw-display.drawing{

    font-size:120px;

    color:#6DBE45;

}

.draw-display.winner{

    font-size:110px;

    color:#6DBE45;

}

.winner-info{

    margin:25px 0;

    padding:20px;

    border-radius:20px;

    background:#f8fff5;

}

.winner-info h2{

    font-size:45px;

    color:#6DBE45;

    margin-bottom:20px;

}

.winner-name{

    font-size:120px;

    font-weight:900;

    line-height:1.1;

    margin-top:10px;

    animation:winnerPulse 1s infinite;

}

.winner-company{

    font-size:55px;

    color:#666;

    margin-top:15px;

}

.winner-ticket{

    font-size:80px;

    font-weight:800;

    color:#6DBE45;

    margin-top:25px;

}

.winner-message{

    font-size:30px;

    color:#444;

    margin-top:20px;

}

@keyframes winnerPulse{

    0%{
        transform:scale(1);
    }

    50%{
        transform:scale(1.05);
    }

    100%{
        transform:scale(1);
    }

}

.draw-btn{

    width:auto;

    min-width:300px;

    padding:18px 35px;

    margin-top:20px;

}

.winner-ticket{

    margin-top:20px;

    font-size:48px;

    font-weight:700;

    color:#6DBE45;

}

/* ================================
   ROUE DE TIRAGE
   ================================ */

.wheel-stage {
    position: relative;
    width: min(520px, 90vw);
    height: min(520px, 90vw);
    margin: 0 auto 24px auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wheel-canvas {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow:
        0 24px 60px rgba(0, 0, 0, 0.28),
        inset 0 0 0 10px rgba(255, 255, 255, 0.85);
}

.wheel-pointer {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
    border-top: 42px solid #111827;
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.25));
}

.wheel-center {
    position: absolute;
    z-index: 4;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #ffffff;
    color: #111827;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.4rem;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.draw-display.waiting {
    text-align: center;
    font-weight: 700;
    margin-bottom: 18px;
}

.draw-display.drawing {
    text-align: center;
    font-weight: 800;
    margin-bottom: 18px;
}

@media (max-width: 700px) {
    .wheel-stage {
        width: min(360px, 88vw);
        height: min(360px, 88vw);
    }

    .wheel-center {
        width: 72px;
        height: 72px;
        font-size: 1rem;
    }
}
/* ================================
   CORRECTION AFFICHAGE PAGE TIRAGE
   ================================ */

.right-panel {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
    box-sizing: border-box;
}

.tirage-card {
    width: 100%;
    max-width: 1100px;
    min-height: auto;
    display: grid;
    grid-template-columns: 520px 1fr;
    align-items: center;
    gap: 56px;
    background: transparent;
    box-shadow: none;
    border: none;
}

.wheel-stage {
    position: relative;
    width: 460px;
    height: 460px;
    margin: 0 auto;
}

.wheel-canvas {
    width: 460px;
    height: 460px;
    border-radius: 50%;
}

.wheel-pointer {
    top: -8px;
}

.draw-display {
    text-align: center;
    color: #67bf43;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3rem, 5vw, 5rem);
    font-weight: 800;
    line-height: 1.1;
}

.winner-info {
    grid-column: 2;
    max-width: 520px;
    text-align: center;
}

.draw-btn {
    grid-column: 2;
    justify-self: center;
    margin-top: 24px;
}

@media (max-width: 1000px) {
    .tirage-card {
        grid-template-columns: 1fr;
        gap: 28px;
    }

    .winner-info,
    .draw-btn {
        grid-column: 1;
    }

    .wheel-stage,
    .wheel-canvas {
        width: 360px;
        height: 360px;
    }
}
