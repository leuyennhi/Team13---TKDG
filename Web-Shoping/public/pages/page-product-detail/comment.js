$(".show-comment").click(function()
{
  $(".reply-comment-component").show();
  $(".hide-comment").show()
  $(".show-comment").hide();
});

$(".hide-comment").click(function()
{
  $(".reply-comment-component").hide();
  $(".show-comment").show();
  $(".hide-comment").hide();
});