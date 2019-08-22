/* Just add this script to html books:
<script src="translate.js"></script>
*/

(function() {
  'use strict';

  var origin = document.location.origin;
  var lastRun = 0;
  var $tooltip = null;
  var $title = null;
  var $def = null;
  var css = `
    BODY {
      color: rgba(129, 109, 129, 1);
      background: black;
    }
  
    o:active, p:active {
      background-color: yellow;
    }
  
    .eo {
      color: #998599;
    }
  
    .eo:active {
      background-color: inherit;
    }
  
    .tooltip {
      font-size: 2.5em;
      text-align: center;
      padding: 20px 0;
  
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
  
      color: #777;
      background: rgba(34, 24, 34, 1);
    }
  
    .tooltip .title {
      margin: 0;
      text-transform: uppercase;
    }
  
    .tooltip .def {
      margin: 0;
    }
  `;
  
  function createTooltip() {
    $title = document.createElement('h4');
    $title.className = 'title';
    $def = document.createElement('p');
    $def.className = 'def';
    $tooltip = document.createElement('div');
    $tooltip.className = 'tooltip';
    $tooltip.appendChild($title)
    $tooltip.appendChild($def)
    
    document.body.insertBefore($tooltip, document.querySelector('p'));
  }
  
  function wrapWords(element) {
    element.innerHTML = element.innerText.split(' ').map(t => `<o>${t}</o>`).join(' ');
  }
  
  function addCSS(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet) { style.styleSheet.cssText = css; } // This is required for IE8 and below.
    else { style.appendChild(document.createTextNode(css)); }
  }
  
  function debouncer() {
    var now = Date.now();
    if (now - lastRun < 1000) { return; }
    lastRun = now;
    console.log(window.scrollY)
    window.localStorage.setItem('scroll', window.scrollY);
  }
  
  function get(word, callback) {
    if (word.length > 22) {
      setTooltip(word, 'search term too long');
      return;
    }
    var xhr = new XMLHttpRequest();
    var url= origin + '/?word=' + word;
    xhr.open("GET", url);
    xhr.send();
  
    xhr.onreadystatechange = function(error) {
      if (xhr.readyState == 4 && xhr.status == 200) { callback(xhr.responseText); }
    }
  }
  
  function setTooltip(word, definition) {
    $tooltip.style.display = 'initial';
    $title.innerText = word;
    $def.innerText = definition;
  }
  
  // -------------------------- Init -------------------------- //
  
  document.addEventListener('DOMContentLoaded', function() {
    var lastLoadScrollY = window.localStorage && window.localStorage.getItem && window.localStorage.getItem('scroll');
    if (lastLoadScrollY) window.scroll(0, lastLoadScrollY);
  
    createTooltip();
    addCSS(css); 
  });
  
  window.addEventListener('scroll', debouncer);
  
  document.body.addEventListener('click', function(event) {
    // prep the paragraph
    if (event.target.nodeName === 'P' && Array.from(event.target.classList).indexOf('eo') === -1) {
      wrapWords(event.target);
      event.target.classList.add('eo');
      setTooltip('initialized paragraph', 'please tap again');
      return;
    }
  
    // if paragraph is prepped, do word search
    var innerText = event && event.target && event.target.innerText;
    if (!innerText) { return; }
    var word = innerText.replace(/[^a-zĉĝĥĵŝŭ'-]/gi, '');
    if (!word) { return; }
  
    setTooltip(word, 'loading...');
    get(word, function(definition) {
      if (!definition || definition === ' ') { setTooltip(word, 'not found'); }
      else { setTooltip(word, definition); }
    });
  });
})();
