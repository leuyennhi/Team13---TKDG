$("input:checkbox.tab").on('click', function() {
    var $box = $(this);
    if ($box.is(":checked")) {
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
    var href = $(this).parent().parent().find("a").attr('href')
    var url = href.replace('detail','product-detail');
    getProduct(url)
  });
  $('.product-selected-list').on('click','.select-product',function() {
    var $box = $(this);
    var type = $box.attr('id')
    if ($box.is(":checked")) {
      $box.prop("checked", true);
      $(`#model-${type}`).css("display","flex");
    } else {
      $box.prop("checked", false);
      $(`#model-${type}`).css("display","none");
    }
  });
var getProduct = (_url) =>{
    console.log(_url)
    $.ajax({
      method: "GET",
      url: _url,
    })
    .done(function( data ) {
       addList(data)
       changeClothe(data)
    });
}
var changeClothe = (product) =>{
    var x = document.getElementById("height").value;
    var y = document.getElementById("waist").value;
    var pos = 1
    if (y>80){
      pos = 2
    }
    else if (x>170){
      size = 0
    }
    $(`#model-${product.type}`).attr("src",`${product.toTryImg[pos]}`);
    $(`#model-${product.type}`).css("display","flex");

}
var addList = (product) =>{
    var x = document.getElementById("height").value;
    var y = document.getElementById("waist").value;
    var size = 'S'
    if (y>80){
      size = 'M'
    }
    else if (x>170){
      size = 'L'
    }
    var item = `<div class="product ${product.type}">
                  <h4 class="name">${product.name}</h4>
                  <h4 class="size">${size}</h4>
                  <h4 class="price">${product.price}<u>đ</u></h4>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input select-product checked" id="${product.type}">
                    <label class="custom-control-label" for="${product.type}"></label>
                  </div>
                </div>`
    $( `.${product.type}` ).remove();
    $('.product-selected-list').append(item)
    $('.selected-products button').css("display","block")
}