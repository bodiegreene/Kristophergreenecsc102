// Wait for the DOM (page content) to fully load before running any JavaScript  // explanation
document.addEventListener("DOMContentLoaded", function () { // run after DOM is ready
  const gameForm = document.getElementById("gameForm"); // get the dice game form by ID
  if (!gameForm) return; // guard: if this page doesn't have the dice form, exit safely
  gameForm.addEventListener("submit", function (event) { // handle dice form submit
    event.preventDefault(); // prevent navigation/reload
    const playerName = document.getElementById("playerName").value; // read player name
    playDiceDuel(playerName); // run the dice game with the provided name
  }); // end submit handler
}); // end DOMContentLoaded

/**
 * Function: playDiceDuel  // description
 * Runs the main game logic.  // description
 */
function playDiceDuel(playerName) { // dice game entry point
  let playerRoll = rollDice(); // random 1–6 for player
  let cpuRoll = rollDice(); // random 1–6 for CPU
  let playerScore = applyBonus(playerRoll); // add bonus if 6
  let cpuScore = applyBonus(cpuRoll); // add bonus if 6
  let result = ""; // result message holder

  if (playerScore > cpuScore) { result = `<strong>${playerName} wins!</strong>`; } // player wins
  else if (cpuScore > playerScore) { result = "<strong>CPU wins!</strong>"; } // CPU wins
  else { result = "<strong>It's a tie!</strong>"; } // tie case

  document.getElementById("gameOutput").innerHTML = `  // update UI via innerHTML
    <p>${playerName} rolled a ${playerRoll} (${playerScore} pts)</p>  // player roll
    <p>CPU rolled a ${cpuRoll} (${cpuScore} pts)</p>  // CPU roll
    <h2>${result}</h2>  // outcome
  `; // end template
} // end playDiceDuel

/**
 * Function: rollDice  // description
 * Returns a random integer 1–6.  // description
 */
function rollDice() { return Math.floor(Math.random() * 6) + 1; } // random 1..6

/**
 * Function: applyBonus  // description
 * Adds +2 if roll is 6.  // description
 */
function applyBonus(roll) { // bonus helper
  if (roll === 6) { return roll + 2; } // add bonus for six
  else { return roll; } // otherwise unchanged
} // end applyBonus


/* =========================
   Meme mover UI add-ons
   (keeps your dice code untouched)
   ========================= */ // section divider

const memeForm  = document.getElementById('memeControls'); // meme Start/Stop form (on index.html)
const startBtn  = document.getElementById('startBtn');     // Start submit button
const stopBtn   = document.getElementById('stopBtn');      // Stop submit button
const statusBox = document.getElementById('memeStatus');   // status display (innerHTML target)

function enableStopDisableStart() { // set UI to "running"
  if (!startBtn || !stopBtn || !statusBox) return; // guard if controls not on this page
  startBtn.disabled = true;  // block double-start
  stopBtn.disabled  = false; // allow stopping
  statusBox.innerHTML = 'Status: <strong>Running</strong> — click Stop to freeze the meme.'; // feedback
} // end helper

function enableStartDisableStop() { // set UI to "stopped"
  if (!startBtn || !stopBtn || !statusBox) return; // guard if controls not on this page
  startBtn.disabled = false; // allow starting again
  stopBtn.disabled  = true;  // nothing to stop now
  statusBox.innerHTML = 'Status: <strong>Stopped</strong> — click Start to move the meme.'; // feedback
} // end helper

function onStartClicked(evt) { // wired via onClick on Start button
  if (evt) evt.preventDefault(); // prevent form navigation
  enableStopDisableStart(); // update UI state
  startMotion(); // call movement function from motion.js (separate file)
  return false; // guard against navigation
} // end onStartClicked

function onStopClicked(evt) { // wired via onClick on Stop button
  if (evt) evt.preventDefault(); // prevent form navigation
  enableStartDisableStop(); // update UI state
  stopMotion(); // call stop function from motion.js (separate file)
  return false; // guard against navigation
} // end onStopClicked

if (statusBox) { statusBox.innerHTML = 'Ready: Click <strong>Start</strong> to begin moving the meme.'; } // initial status
