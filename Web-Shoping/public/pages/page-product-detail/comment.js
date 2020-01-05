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

var starR = 5;
$('.star').click(function() {
  starR = parseInt($(this).attr('s'));
});
$('#review-form').submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  var form = $(this);
  var _id = form.attr('idP');
  var form_data = {
    title: form.find('.title').val(),
    star: starR,
    content: form.find('.content').val(),
    id: _id
  };
  $.ajax({
    url: '/addcomment',
    type: 'POST',
    data: form_data
  }).done(function(response) {
    var comment;
    if (response.star >= 4) {
      var ratingStars = '';
      for (let i = 0; i < response.star; i++) {
        ratingStars += '<span class="fa fa-star append-comment-star"></span>';
      }
      for (let i = 0; i < 5 - response.star; i++) {
        ratingStars +=
          '<span class="fa fa-star append-comment-grey-star"></span>';
      }

      var isBought = response.isBought
        ? '<p class="bought">Đã mua sản phẩm này tại Unicorn</p>'
        : '<p class="unbought"><i class="fas fa-exclamation-circle"></i>&ensp;Chưa mua sản phẩm</p>';
      comment = `<div class="comment">
                  <div class="comment-item">
                    <div class="my-photo">
                      <a href="#"><img class="img-circle" src=${response.avatar} alt="My Image" /></a>
                      <div class="name">${response.name}</div>
                      <p class="time">${response.formatDate}</p>
                    </div>

                    <div class="information clearfix">
                      <div style="display: flex; align-items: center;">
                        <div class="stars">
                          ${ratingStars}
                        </div>
                        <p class="review">${response.title}</p>
                      </div>

                      ${isBought}

                      <div class="description js-description">
                        <span>${response.content}</span>
                      </div>
                    </div>
                  </div>
                </div>`;
    } else {
      comment = `<div class="comment">
                  <div class="comment-item">
                    <div class="my-photo">
                      <a href="#"><img class="img-circle" src="${response.avatar}" alt="My Image" /></a>
                      <div class="name">${response.name}</div>
                      <p class="time">${response.formatDate}</p>
                    </div>
                    <div class="information clearfix">
                      <div class="description js-description">
                        <span>Bình luận của bạn đang trong trạng thái chờ duyệt.</span>
                      </div>
                    </div>
                  </div>
                </div>`;
    }

    var ratingBars = '';
    for (let i = 0; i < response.ratings.bars.length; i++) {
      ratingBars += `<div class="item-detail-rating">
                      <div class="star">
                        ${response.ratings.bars[i].number}
                        <i class="fa fa-star icon-star"></i>
                      </div>
                      <div class="progress my-process">
                        <div class="progress-bar my-process-bar" role="progressbar" style="width: ${response.ratings.bars[i].percent}%"
                          aria-valuenow=${response.ratings.bars[i].percent} aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div class="percent">${response.ratings.bars[i].percent}%</div>
                    </div>`;
    }

    $('.comments-component').prepend(comment);
    $('.evaluation-button-component .comment-bnt').trigger('click');
    $('.evaluation-component .average-rating h1').html(
      `${response.ratings.averageStar}/5 <i class="fa fa-star icon-star"></i>`
    );
    $('.evaluation-component .average-rating h4').html(
      `(${response.ratings.reviewQuantity} bình luận)`
    );
    $('.evaluation-component .detail-rating').html(ratingBars);
    form[0].reset();
  });
});
