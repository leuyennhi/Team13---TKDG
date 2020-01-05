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

var starR = 5
$('.star').click(function(){
  starR = parseInt($(this).attr("s"));
})
$('#review-form').submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  var form = $(this);
  var _id = form.attr("idP")
  var form_data = {
    title: form.find('.title').val(),
    star: starR,
    content: form.find('.content').val(),
    id: _id
  }
  $.ajax({
		url : '/addcomment',
		type: 'POST',
		data : form_data
	}).done(function(response){
    var comment
    if(response.star == 5)
		{
      comment =  `<div class="comment">
                        <div class="comment-item">
                          <div class="my-photo">
                            <a href="#"><img class="img-circle" src="${response.avatar}" alt="My Image" /></a>
                            <h5>${response.name}</h5>
                            <p class="time">${response.formatDate}</p>
                          </div>
                          <div class="information clearfix">
                            <div style="display: flex; align-items: center;">
                              <div class="stars">
                                <label class="star star-5" for="star-5"></label>
                                <label class="star star-4" for="star-4"></label>
                                <label class="star star-3" for="star-3"></label>
                                <label class="star star-2" for="star-2"></label>
                                <label class="star star-1" for="star-1"></label>
                              </div>
                              <p class="review">${response.title}</p>
                            </div>
                            <p class="buy-already">Đã mua sản phẩm này tại Unicorn Shop</p>
                            <div class="description js-description">
                              <span>${response.content}</span>
                            </div>
                          </div>
                        </div>
                      </div>`
      } else {
        comment =  `<div class="comment">
        <div class="comment-item">
          <div class="my-photo">
            <a href="#"><img class="img-circle" src="${response.avatar}" alt="My Image" /></a>
            <h5>${response.name}</h5>
            <p class="time">${response.formatDate}</p>
          </div>
          <div class="information clearfix">
              <p class="review">Comment của bạn đang được duyệt, vui lòng chờ giây lát....</p>
        </div>
      </div>`
      }
      $(".comments-component").prepend(comment);
    form[0].reset();
  });
});
