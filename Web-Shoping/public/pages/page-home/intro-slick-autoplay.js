$('.intro-slick-autoplay').on('init', function(event, slick) {
  $('.intro-slick-autoplay').css({
    opacity: '1',
    visibility: 'visible' // visible when loaded
  });
});

$('.intro-slick-autoplay').slick({
  dots: true,
  arrows: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false
      }
    }
  ]
});

$('.intro-slick-autoplay').on('beforeChange', function(
  event,
  slick,
  currentSlide,
  nextSlide
) {
  $('.intro-slick-autoplay .slick-dots li').removeClass('slick-active');
  $('.intro-slick-autoplay .slick-dots li button')
    .attr('aria-pressed', 'false')
    .focus(function() {
      this.blur();
    });
});
