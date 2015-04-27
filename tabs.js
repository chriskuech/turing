$(function () {

"use strict";


$('.tab-header-container').click(function () {
  $('.tab-header-container').removeClass('active');
  $('.tab').hide();
  $($(this).attr('data-content-sel')).show();
  $(this).removeClass('notification').addClass('active');
});
$('.tab-header-container')[0].click();



window.tabs = {
  notify: function (sel) {
    $('.tab-header-container[data-content-sel="'+sel+'"]:not(.active)')
        .addClass('notification');
  },
  open: function (sel) {
  	$('.tab-header-container[data-content-sel="'+sel+'"]').click();
  }
};



});

