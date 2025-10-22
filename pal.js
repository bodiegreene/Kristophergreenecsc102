// =============================
// File: pal.js
// Author: Kristopher Greene
// Purpose: Palindrome Checker for Assignment 5.1
// Strict requirements satisfied:
//  - Use a FORM with SUBMIT for ALL input (no prompt(), no alerts).
//  - Use innerHTML for validation + results (no alerts).
//  - DO NOT use addEventListener (we assign form.onsubmit directly).
//  - NO JavaScript functions inside HTML attributes (no inline handlers).
//  - Implement a loop: (1) algorithmic for-loop for mirror checks, and
//    (2) a user-driven continue/exit flow using radios within the same form.
// =============================

// --------------- DOM references (script loaded with defer so DOM is parsed) ---------------
// Get the palindrome form element by ID
var palForm = document.getElementById('palForm'); // main form node
// Get the text box where the user types the candidate string
var textBox = document.getElementById('userText'); // input[type=text]
// Get the messages box where we write validation + results using innerHTML
var messages = document.getElementById('messages'); // live region for feedback
// Get the UL element that will store a running history of checks
var historyList = document.getElementById('historyList'); // list of prior runs
// Get the continue/exit fieldset (hidden until after first submit)
var continueGroup = document.getElementById('continueGroup'); // radios group
// Get the submit button so we can update its label after first run
var submitBtn = document.getElementById('submitBtn'); // submit button

// --------------- State to summarize a session ---------------
// Keep each run in an array so we can compute totals when user exits
var runs = []; // array of { original: string, cleaned: string, isPal: boolean, time: number }

// --------------- Helper: normalize user input for palindrome testing ---------------
// Remove spaces + punctuation; keep letters/digits; lower-case for case-insensitive compare.
function normalize(s) { // start normalize function
  var base = String(s); // ensure string
  var lower = base.toLowerCase(); // case-insensitive
  var stripped = lower.match(/[a-z0-9]/g); // keep only letters and digits
  return stripped ? stripped.join('') : ''; // join or return empty string
} // end normalize

// --------------- Helper: isPalindrome using a for-loop (mirrored comparison) ---------------
function isPalindrome(cleaned) { // start isPalindrome
  // Use i from front and j from end; compare until they cross
  for (var i = 0, j = cleaned.length - 1; i < j; i++, j--) { // loop over pairs
    if (cleaned.charAt(i) !== cleaned.charAt(j)) { // mismatch found
      return false; // not a palindrome
    } // end if mismatch
  } // end for
  return true; // all mirrored pairs matched
} // end isPalindrome

// --------------- Helper: render a single history row ---------------
function appendHistory(entry) { // start appendHistory
  // Create an LI to hold this result
  var li = document.createElement('li'); // list item
  // Create a div for the left text (original input quoted)
  var left = document.createElement('div'); // left container
  left.textContent = '“' + entry.original + '”'; // quote original input
  // Create a span chip for the right result label
  var chip = document.createElement('span'); // result chip
  chip.className = 'chip ' + (entry.isPal ? 'ok' : 'bad'); // style based on result
  chip.textContent = entry.isPal ? 'palindrome' : 'not a palindrome'; // label text
  // Assemble and attach to the list
  li.appendChild(left); // add left text
  li.appendChild(chip); // add chip
  historyList.appendChild(li); // append to UL
} // end appendHistory

// --------------- REQUIRED: handle ALL input via form submit; no addEventListener ---------------
palForm.onsubmit = function(evt) { // start submit handler
  evt.preventDefault(); // stop navigation / page reload

  messages.innerHTML = ''; // clear previous feedback via innerHTML

  var raw = textBox.value; // read the user's text
  var cleaned = normalize(raw); // normalize per spec

  if (!cleaned.length) { // if nothing to check
    messages.innerHTML = '<p><strong>Please enter letters or numbers</strong> — spaces and punctuation are ignored.</p>'; // validation
    textBox.focus(); // focus input
    return false; // stop
  } // end empty validation

  var pal = isPalindrome(cleaned); // compute result using loop-based compare

  if (pal) { // if palindrome
    messages.innerHTML = '<p>✅ <strong>Yes!</strong> <em>“' + raw + '”</em> is a palindrome.</p>'; // positive message
  } else { // not palindrome
    messages.innerHTML = '<p>❌ <strong>Nope.</strong> <em>“' + raw + '”</em> is not a palindrome.</p>'; // negative message
  } // end if result

  var entry = { original: raw, cleaned: cleaned, isPal: pal, time: Date.now() }; // pack data
  runs.push(entry); // save in history
  appendHistory(entry); // render into UL

  continueGroup.classList.remove('hidden'); // reveal continue radios
  submitBtn.textContent = 'Submit Response'; // update button label

  // Read the continue choice from the form (default yes)
  var formData = new FormData(palForm); // gather fields
  var choice = String(formData.get('continue') || 'yes').toLowerCase(); // default yes

  if (choice === 'no') { // user done; exit loop
    var total = runs.length; // count entries
    var pals  = 0; // count palindromes
    for (var k = 0; k < runs.length; k++) { // loop over runs to count palindromes
      if (runs[k].isPal) pals++; // increment if palindrome
    } // end count loop
    var non   = total - pals; // non-palindromes

    // Add a summary line via innerHTML
    var endNote = document.createElement('div'); // container
    endNote.innerHTML = '<p><strong>Session complete.</strong> Checked <strong>' + total + '</strong> entr' + (total===1?'y':'ies') + ': ' +
                        '<span class="chip ok">' + pals + ' palindrome</span>, ' +
                        '<span class="chip bad">' + non + ' not a palindrome</span>.</p>'; // summary string
    messages.appendChild(endNote); // append to message area

    // Disable form to signal we exited the loop
    textBox.disabled = true; // disable text input
    submitBtn.disabled = true; // disable submit
    continueGroup.classList.add('hidden'); // hide radios

  } else { // keep going
    textBox.value = ''; // clear input
    textBox.focus(); // focus for next entry
  } // end continue branch

  return false; // guard return
}; // end onsubmit
