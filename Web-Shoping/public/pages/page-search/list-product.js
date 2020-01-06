$('.filter-item-icon').click(function() {
    if ($(this).hasClass('zmdi-chevron-left')) {
      $(this).removeClass('zmdi-chevron-left');
      $(this).addClass('zmdi-chevron-down');
    } else {
      $(this).removeClass('zmdi-chevron-down');
      $(this).addClass('zmdi-chevron-left');
    }
  });
  function rangeSlider(value) {
    document.getElementById('rangeValue').innerHTML = value;
  }
  