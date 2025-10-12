const memeEl  = document.getElementById('memeimage'); // the meme image to move
let moveTimer = null; // setInterval handle (null = not moving)
let posX = 20;        // current x position in px
let posY = 20;        // current y position in px
let velX = 3;         // horizontal speed (px per tick)
let velY = 2;         // vertical speed (px per tick)
const TICK_MS = 16;   // update every ~16 ms (~60 FPS)

function startMotion() { // begin moving the meme
  if (!memeEl) return; // guard if the image isn't on this page
  if (moveTimer) return; // already running
  memeEl.style.position = 'fixed'; // use viewport bounds (no special wrapper needed)
  memeEl.style.left = posX + 'px'; // apply starting x
  memeEl.style.top  = posY + 'px'; // apply starting y
  velX = (Math.random()*2 + 2) * (Math.random() < 0.5 ? -1 : 1); // randomize X speed/dir
  velY = (Math.random()*2 + 1) * (Math.random() < 0.5 ? -1 : 1); // randomize Y speed/dir

  moveTimer = setInterval(() => { // periodic updates
    const maxX = window.innerWidth  - memeEl.offsetWidth;  // right boundary
    const maxY = window.innerHeight - memeEl.offsetHeight; // bottom boundary
    posX += velX; // advance x
    posY += velY; // advance y
    if (posX <= 0 || posX >= maxX) { velX = -velX; posX = Math.max(0, Math.min(posX, maxX)); } // bounce LR
    if (posY <= 0 || posY >= maxY) { velY = -velY; posY = Math.max(0, Math.min(posY, maxY)); } // bounce TB
    memeEl.style.left = posX + 'px'; // apply x
    memeEl.style.top  = posY + 'px'; // apply y
  }, TICK_MS); // repeat
} // end startMotion

function stopMotion() { // stop moving the meme
  if (!moveTimer) return; // already stopped
  clearInterval(moveTimer); // cancel timer
  moveTimer = null; // mark as stopped
} // end stopMotion
