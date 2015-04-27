(function () {


"use strict";


var head;
var speed;


function new_cell() {
  var n = 0;
  var c = String.fromCharCode(n);
  return $('<div class="cell"><span class="character">'+c+'</span><div class="charcode">'+n+'</div></div>');
}


function append_cell_left(cell) {
  $('#cells').width( $('#cells').width() + 50 );
  return $('#writable-cells').prepend(cell);
}


function append_cell_right(cell) {
  $('#cells').width( $('#cells').width() + 50 );
  return $('#writable-cells').append(cell);
}


function update_tape_offset(callback) {
  // var tape_offset = ($('#cells .cell').length + head) * 50;
  var tape_offset = head * 50;
  var head_offset = $('#main-container').width() / 2 - 0.5 * 50;
  var offset = head_offset - tape_offset;
  $('#cells').animate({left: offset+'px'}, speed, callback);
}


function move_head_left(callback) {
  if (--head === 0) {
    head = 1;
    append_cell_left(new_cell());
  }
  update_tape_offset(callback);
}


function move_head_right(callback) {
  if (++head === $('#cells .cell').length - 1) {
    append_cell_right(new_cell());
  }
  update_tape_offset(callback);
}







function init() {
  head = 1;
  update_tape_offset();
  $('#writable-cells').html(new_cell()); //('<div class="cell">0</div>');  
}


$(init);







$(function () {
  // init speed toggle
  $('.speed-toggle-button').click(function () {
    $('.speed-toggle-button').removeClass('active');
    $(this).addClass('active');
    speed = Number($(this).attr('data-speed'));
  });
  $('[data-speed="100"]').click();
});















window.machine = {
  halted: true,
  reset: init,
  speed: function (ms) {
    if (typeof ms === "number")
      speed = ms;
    return speed;
  },

  /**
   * Halt
   */
  accept: function () {
    terminal.accept();
    machine.halted = true;
    $('html, body').css('cursor', 'auto');
  },
  reject: function () {
    terminal.reject();
    machine.halted = true;
    $('html, body').css('cursor', 'auto');
  },
  halt: function () {
    terminal.halt();
    machine.halted = true;
    $('html, body').css('cursor', 'auto');
  },

  /**
   * I/O
   */
  read: function () {
    var n = Number($('#cells .cell:eq('+head+') .charcode').text());
    return n;
  },
  write: function (n, callback) {
    $('#cells .cell:eq('+head+') .character').text(String.fromCharCode(n));
    $('#cells .cell:eq('+head+') .charcode').text(n);
    setTimeout(callback, speed);
  },
  move: function (dir, callback) {
    ({
      'left':  move_head_left,
      'right': move_head_right
    })[dir](callback);
  }

}




})();