$('.page-shopping-cart .nav .nav-link').click(function() {
  $('.page-shopping-cart .nav .nav-link').removeClass('is-active');
  $(this)
    .prevAll('a')
    .addClass('is-active');
});
