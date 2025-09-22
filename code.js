// Wait for the DOM (page content) to fully load before running any JavaScript
document.addEventListener("DOMContentLoaded", function () {

  // Get reference to the form element using its ID
  const gameForm = document.getElementById("gameForm");

  // Add an event listener that listens for form submission
  gameForm.addEventListener("submit", function (event) {
    
    // Prevent the form from submitting normally (i.e., don't reload the page)
    event.preventDefault();

    // Get the value entered by the user in the name input field
    const playerName = document.getElementById("playerName").value;

    // Call the function to start the game, passing in the player's name
    playDiceDuel(playerName);
  });
});

/**
 * Function: playDiceDuel
 * This function runs the main game logic.
 * It takes the player's name, simulates dice rolls, compares scores,
 * and updates the page with the results using innerHTML.
 */
function playDiceDuel(playerName) {
  // Generate a random number (1–6) for the player
  let playerRoll = rollDice();

  // Generate a random number (1–6) for the CPU
  let cpuRoll = rollDice();

  // Apply bonus points to the player's roll if they rolled a 6
  let playerScore = applyBonus(playerRoll);

  // Apply bonus points to the CPU's roll if it rolled a 6
  let cpuScore = applyBonus(cpuRoll);

  // Initialize a variable to store the result message
  let result = "";

  // Compare scores and decide who wins
  if (playerScore > cpuScore) {
    // If the player's score is higher, they win
    result = `<strong>${playerName} wins!</strong>`;
  } else if (cpuScore > playerScore) {
    // If the CPU's score is higher, it wins
    result = "<strong>CPU wins!</strong>";
  } else {
    // If both scores are equal, it's a tie
    result = "<strong>It's a tie!</strong>";
  }

  // Use innerHTML to display the rolls, scores, and result in the HTML page
  document.getElementById("gameOutput").innerHTML = `
    <p>${playerName} rolled a ${playerRoll} (${playerScore} pts)</p>
    <p>CPU rolled a ${cpuRoll} (${cpuScore} pts)</p>
    <h2>${result}</h2>
  `;
}

/**
 * Function: rollDice
 * Simulates rolling a six-sided dice.
 * Returns a random integer between 1 and 6.
 */
function rollDice() {
  return Math.floor(Math.random() * 6) + 1; // Random number from 1 to 6
}

/**
 * Function: applyBonus
 * Takes a dice roll and adds 2 bonus points if it's a 6.
 * @param {number} roll - The dice number rolled (1–6)
 * @returns {number} - The total score after applying bonus
 */
function applyBonus(roll) {
  if (roll === 6) {
    // If roll is 6, give a bonus of 2 points
    return roll + 2;
  } else {
    // Otherwise, return the roll as-is
    return roll;
  }
}
 