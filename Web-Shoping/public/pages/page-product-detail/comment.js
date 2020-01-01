$('.show-comment').click(function() {
  var text = $(this)
    .text()
    .trim();
  if (text == 'Xem phản hồi') {
    $(this).text('Ẩn phản hồi');
  } else {
    $(this).text('Xem phản hồi');
  }
});
