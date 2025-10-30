// Kristopher Greene  // author
// pal.js            // palindrome analyzer script

// --------- ids  ---------
var palForm   = document.getElementById('palForm');    // the form
var palText   = document.getElementById('palText');    // input
var msgBox    = document.getElementById('msg');        // validation box
var reportBox = document.getElementById('report');     // result panel
var statsBox  = document.getElementById('stats');      // stats panel
var historyUl = document.getElementById('historyList');// history panel
var freqUl    = document.getElementById('freqList');   // A–Z list

// -------------- escape for safe innerHTML  --------------
function esc(s){ // escape
  s = String(s);
  var map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  return s.replace(/[&<>"']/g, function(m){ return map[m]; });
} // end esc

// -------------- (objects + loops) --------------
function Tools(raw){ // constructor
  this.original = raw;
  this.cleaned  = '';
  this.reversed = '';
  this.lengths  = { original:0, cleaned:0 };
  this.counts   = { letters:0, digits:0, spaces:0, other:0 };
  this.alpha    = {}; // a-z freq
  this.isPal    = false;
  this.firstMismatch = null; // index pair
} // end constructor

Tools.prototype.sanitize = function(){ // keep a-z0-9
  var t = this.original.trim();
  this.cleaned = t.toLowerCase().replace(/[^a-z0-9]/g,'');
  this.lengths.original = t.length;
  this.lengths.cleaned  = this.cleaned.length;
  return this;
}; // end sanitize

Tools.prototype.reverse = function(){ // build reversed with loop
  var out='';
  for (var i=0;i<this.cleaned.length;i++){ out = this.cleaned.charAt(i) + out; } // prepend
  this.reversed = out;
  return this;
}; // end reverse

Tools.prototype.decide = function(){ // palindrome  (mirror check)
  var ok = true;
  var L = this.cleaned.length;
  for (var i=0;i<Math.floor(L/2);i++){ // mirror loop
    if (this.cleaned.charAt(i) !== this.cleaned.charAt(L-1-i)){
      ok = false;
      this.firstMismatch = {left:i, right:L-1-i};
      break;
    }
  }
  this.isPal = (L>=2 && ok);
  return this;
}; // end decide

Tools.prototype.tally = function(){ // category counts + a-z histogram
  var t = this.original.trim();
  this.counts = {letters:0,digits:0,spaces:0,other:0};
  this.alpha  = {};
  for (var k=0;k<26;k++){ this.alpha[String.fromCharCode(97+k)] = 0; } // a..z
  for (var j=0;j<t.length;j++){
    var ch = t.charAt(j);
    if (/[a-zA-Z]/.test(ch)){ this.counts.letters++; this.alpha[ch.toLowerCase()] = (this.alpha[ch.toLowerCase()]||0)+1; }
    else if (/[0-9]/.test(ch)){ this.counts.digits++; }
    else if (ch === ' '){ this.counts.spaces++; }
    else { this.counts.other++; }
  }
  return this;
}; // end tally

Tools.prototype.view = function(){ // build HTML
  var safeO = esc(this.original.trim());
  var safeC = esc(this.cleaned);
  var safeR = esc(this.reversed);
  var ok    = this.isPal;
  var verdict  = ok ? '✅ palindrome' : '❌ not a palindrome';
  var toneCls  = ok ? 'good' : 'bad';

  var mismatch = '';
  if (!ok && this.firstMismatch){ // show indices if not palindrome
    mismatch = '<div class="muted">first mismatch at positions <span class="mono">' + this.firstMismatch.left + '</span> vs <span class="mono">' + this.firstMismatch.right + '</span></div>';
  }

  var left = ''
    + '<div class="pill mono">original</div>'
    + '<div class="stat"><span class="muted">you entered</span><b class="mono">' + (safeO||'(empty)') + '</b></div>'
    + '<div class="stat"><span class="muted">cleaned</span><b class="mono">' + (safeC||'(n/a)') + '</b></div>'
    + '<div class="stat"><span class="muted">reversed</span><b class="mono">' + (safeR||'(n/a)') + '</b></div>'
    + '<div class="sep"></div>'
    + '<div class="msg ' + toneCls + ' flash"><b>' + verdict + '</b></div>' + (mismatch||'');

  var right = ''
    + '<div class="pill">quick stats</div>'
    + '<div class="stat"><span>original length</span><b class="count" data-to="' + this.lengths.original + '">0</b></div>'
    + '<div class="stat"><span>cleaned length</span><b class="count" data-to="' + this.lengths.cleaned  + '">0</b></div>'
    + '<div class="sep"></div>'
    + '<div class="stat"><span>letters</span><b class="count" data-to="' + this.counts.letters + '">0</b></div>'
    + '<div class="stat"><span>digits</span><b class="count" data-to="' + this.counts.digits  + '">0</b></div>'
    + '<div class="stat"><span>spaces</span><b class="count" data-to="' + this.counts.spaces  + '">0</b></div>'
    + '<div class="stat"><span>other</span><b class="count" data-to="'   + this.counts.other   + '">0</b></div>';

  return {left:left, right:right, verdict:verdict};
}; // end view

// -------------- UI helpers --------------
var UI = {
  showValidation: function(t, good){
    var cls = good ? 'msg good' : 'msg bad';
    msgBox.innerHTML = t ? '<div class="' + cls + '">' + esc(t) + '</div>' : '';
  },
  showPanels: function(view){
    reportBox.innerHTML = view.left;
    statsBox.innerHTML  = view.right;
    animateCounts(); // numbers count up
  },
  setFreq: function(alpha){ // fill A–Z list
    if (!freqUl) return;
    var html = '';
    for (var k=0;k<26;k++){
      var ch = String.fromCharCode(97+k);
      var n  = alpha[ch] || 0;
      html += '<li><span>' + ch + '</span><span class="count">' + n + '</span></li>';
    }
    freqUl.innerHTML = html;
  },
  pushHistory: function(raw, verdict){
    var li = document.createElement('li');
    var good = verdict.indexOf('✅') === 0;
    li.innerHTML = '<span class="mono">' + esc(raw) + '</span>'
                 + '<span class="chip ' + (good?'ok':'bad') + '">' + esc(verdict) + '</span>';
    historyUl.prepend(li);
    while (historyUl.children.length > 5){ historyUl.removeChild(historyUl.lastChild); } // keep last 5
  }
};

// -------------- count up animation  --------------
function animateCounts(){
  var nodes = statsBox.querySelectorAll('.count');
  for (var i=0;i<nodes.length;i++){
    (function(span){
      var target = parseInt(span.getAttribute('data-to')||'0',10);
      var cur = 0; var steps = 16; var inc = Math.max(1, Math.ceil(target/steps));
      var timer = setInterval(function(){
        cur += inc;
        if (cur >= target){ cur = target; clearInterval(timer); }
        span.textContent = String(cur);
      }, 20);
    })(nodes[i]);
  }
}

// -------------- onsubmit only  --------------
if (palForm) { // guard
  palForm.onsubmit = function(evt){
    if (evt && evt.preventDefault) evt.preventDefault(); // stop nav

    var raw = palText.value;
    var trimmed = raw.trim();

    if (trimmed.length < 2){
      UI.showValidation('please enter at least 2 characters to analyze.');
      reportBox.innerHTML = '';
      statsBox.innerHTML  = '';
      if (freqUl) freqUl.innerHTML = '';
      return false;
    }
    if (!/[a-z0-9]/i.test(trimmed)){
      UI.showValidation('please include at least one letter or number.');
      reportBox.innerHTML = '';
      statsBox.innerHTML  = '';
      if (freqUl) freqUl.innerHTML = '';
      return false;
    }

    UI.showValidation('input looks good. see analysis below.', true);

    var t = new Tools(raw).sanitize().reverse().decide().tally(); // pipeline
    var view = t.view();  // html
    UI.showPanels(view);  // inject
    UI.setFreq(t.alpha);  // a-z list
    UI.pushHistory(trimmed, view.verdict); // history

    palText.focus(); palText.select && palText.select(); // UX

    return false; // stay on page
  };
} // end guard