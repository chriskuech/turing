(function (window) {

"use strict";



var putting = false;



function prompt(text, callback) {
  function keypresshandler(e) {
    if (e.which === 13) { // Enter key
      var v = $(this).val();
      $('#terminal-prompt-text').text('');
      $('#terminal-prompt-input').off('keypress', keypresshandler);
      $(this).val('').hide();
      callback(v);
    }
  }
  $('#terminal-prompt-input').show();
  $('#terminal-prompt-text').text(text);
  $('#terminal-prompt-input').on('keypress', keypresshandler);
  tabs.notify('#terminal');
}



function clip() {
  var visible = $('#terminal').is(':visible');
  if (!visible) $('#terminal').show();
  var maxheight = $('#terminal-display').height() - $('#terminal-prompt-input').height();
  while ($('#terminal-lines').height() > maxheight)
    $('#terminal-lines .line:first').remove();
  if (!visible) $('#terminal').hide();
}



function println(text) {
  $('#terminal-lines').append($('<div class="line">&gt; '+text+'</div>'));
  putting = false;
  tabs.notify("#terminal");
  clip();
}









$(function init() {
  $('#terminal-prompt-input')
    .hide()
    .on('keydown', function (e) {
      if (e.which !== 13 && $(this).val().length) {
        $(this).val('');
      }
    });
});




window.terminal = {
  start: function () {
    println("Running program...");
  },
  accept: function () {
    println("ACCEPT - the machine accepted the string");
    putting = false;
  },
  reject: function () {
    println("REJECT - the machine rejected the string");
    putting = false;
  },
  halt: function () {
    println("HALT - the machine halted without accepting or rejecting");
    putting = false;
  },
  get: function (callback) {
    function oninput(s) {
      if (s.length === 0) {
        terminal.get(callback);
      } else {
        callback(s.charAt(0));
      }
    }
    prompt("enter a character, then hit enter", oninput);
  },
  put: function (c) {
    if (!putting) {
      $('#terminal-lines').append($('<div class="line">&gt; </div>'));
      clip();
      putting = true;
    }
    var $line = $('#terminal-lines .line:last');
    $line.html($line.html() + c);
    tabs.notify("#terminal");
  },
  error: function (msg) {
    println(msg);
    $('#terminal-lines .lines:last').css('color', 'red');
  }
}



})(window);