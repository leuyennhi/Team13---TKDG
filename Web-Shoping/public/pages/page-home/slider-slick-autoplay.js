$('.component-slider .slick-autoplay').on('init', function(event, slick) {
  $('.component-slider .slick-autoplay').css({
    opacity: '1',
    visibility: 'visible'
  });

  $('.slick-active .item .caption .title').removeClass('hidden');
  $('.slick-active .item .caption .title').addClass('ani-1');

  $('.slick-active .item .caption .content').removeClass('hidden');
  $('.slick-active .item .caption .content').addClass('ani-2');

  $('.slick-active .item .caption .more .btn-1').removeClass('hidden');
  $('.slick-active .item .caption .more .btn-1').addClass('ani-3');

  $('.slick-active .item .caption .more .btn-2').removeClass('hidden');
  $('.slick-active .item .caption .more .btn-2').addClass('ani-4');
});

$('.component-slider .slick-autoplay')
  .not('.slick-initialized')
  .slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    draggable: false,
    pauseOnHover: false,
    fade: true,
    cssEase: 'linear'
  });

$('.component-slider .prevArrow').click(function() {
  $('.component-slider .slick-autoplay').slick('slickPrev');
});

$('.component-slider .nextArrow').click(function() {
  $('.component-slider .slick-autoplay').slick('slickNext');
});

$('.component-slider .slick-autoplay').on('beforeChange', function(
  event,
  slick,
  currentSlide,
  nextSlide
) {
  $('.component-slider .nextArrow').addClass('hidden');

  $('.slick-active .item .caption .title').removeClass('ani-1');
  $('.slick-active .item .caption .title').addClass('hidden');

  $('.slick-active .item .caption .content').removeClass('ani-2');
  $('.slick-active .item .caption .content').addClass('hidden');

  $('.slick-active .item .caption .more .btn-1').removeClass('ani-3');
  $('.slick-active .item .caption .more .btn-1').addClass('hidden');

  $('.slick-active .item .caption .more .btn-2').removeClass('ani-4');
  $('.slick-active .item .caption .more .btn-2').addClass('hidden');

  $('.component-slider .slick-autoplay .slick-dots li').removeClass(
    'slick-active'
  );
  $('.component-slider .slick-autoplay .slick-dots li button')
    .attr('aria-pressed', 'false')
    .focus(function() {
      this.blur();
    });
});

$('.component-slider .slick-autoplay').on('afterChange', function(
  event,
  slick,
  currentSlide,
  nextSlide
) {
  $('.component-slider .nextArrow').removeClass('hidden');
  $('.slick-active .item .caption .title').removeClass('hidden');
  $('.slick-active .item .caption .title').addClass('ani-1');

  $('.slick-active .item .caption .content').removeClass('hidden');
  $('.slick-active .item .caption .content').addClass('ani-2');

  $('.slick-active .item .caption .more .btn-1').removeClass('hidden');
  $('.slick-active .item .caption .more .btn-1').addClass('ani-3');

  $('.slick-active .item .caption .more .btn-2').removeClass('hidden');
  $('.slick-active .item .caption .more .btn-2').addClass('ani-4');
});
