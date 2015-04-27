$(function () {

"use strict";


function updatelines() {
  var nlines = $('#editor textarea').val().split('\n').length;
  var $lines = $('#editor .line');
  var len = $lines.length;
  for (var i = len; i < nlines; i++)
    $('#line-numbers').append('<div class="line">' + (i + 1) + '. </div>');
  for (var i = len - 1; i >= nlines; i--)
    $lines[i].remove();
  $('#editor textarea').css({
    'paddingLeft': 20 + numwidth() + 'px',
    'width': 700 - 30 - numwidth() + 'px',
    'maxWidth': 700 - 30 - numwidth() + 'px',
    'height': $('#tab-container').height() - 20 + 'px !important'
  });
}


function numwidth() {
  return $('#line-numbers').toArray().reduce(function (v, e) {
      return Math.max(v, $(e).width());
    }, 0);
}



$('#editor button#run').on('click', function () {
  if (machine.halted) {
    machine.reset();
    window.interpret($('#editor textarea').val() || '');
  }
});


$('#editor textarea').on('keyup', updatelines);


$('#editor textarea').on('scroll', function () {
  $('#line-numbers').css({
    top: -$(this).scrollTop() + 'px',
    boxShadow: $(this).scrollLeft() > 0 ? '0 0 20px #111' : 'none',
    borderRight: $(this).scrollLeft() > 0 ? '1px solid #444' : 'none'
  });
});




updatelines();




});