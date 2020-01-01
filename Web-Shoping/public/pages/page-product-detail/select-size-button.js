$('.btn-size').click(function() {
  $('.btn-size').removeClass('size-selected');
  $(this).addClass('size-selected');
});

$('.btn-color').click(function() {
  $('.btn-color').removeClass('color-selected');
  $(this).addClass('color-selected');
});

$(document).ready(function() {
  $('.btn-size')
    .first()
    .addClass('size-selected');
  $('.btn-color')
    .first()
    .addClass('color-selected');
});
