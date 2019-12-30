
var img = []
var topM = 0
var leftM = 0
var model = ""
var posImg = -1
var size = ""
var total = 0
var priceM = {
  skirt: 0,
  dress: 0,
  shirt: 0,
  short: 0,
}
var type_color = {};
var getFigureM = ()=>{
  var x = document.getElementById("height").value;
  var y = document.getElementById("waist").value;

  model = "/images/Models/2.png";
  posImg = "model2";
  size = "S"
  if (y>80){
   model = "/images/Models/3.png";
   posImg = "model3";
   size = "L"
  }
  else if (x>170){
    model = "/images/Models/1.png";
    posImg = "model1"
    size = "M"
  }
}
var getFigure = (type) =>{
  var x = document.getElementById("height").value;
  var y = document.getElementById("waist").value;
  switch(type) {
    case "shirt":
      {
        topM = 124;
        leftM = -4;
        if (y>80){
          topM = 130
          leftM = -4
        }
        else if (x>170){
          topM = 95
          leftM = -5;
        }
        break;
      }
    case "skirt":
        {
          topM = 224
          leftM = -8
          if (y>80){
            topM = 224
            leftM = -6
          }
          else if (x>170){
            topM = 196
            leftM =-6
          }
          break;
        }
    case "dress":
        {
          topM = 134
          leftM = -4
          if (y>80){
            topM = 138
            leftM = -4
          }
          else if (x>170){
            topM = 105
            leftM = -4
          }
          break;
        }
    case "short":
        {
          topM = 224
          leftM = -8
          if (y>80){
            topM = 224
            leftM = -6
          }
          else if (x>170){
            topM = 196
            leftM =-6
          }
          break;
        }
    default:
      break;
  }
}
var onClickModel = () =>{
  getFigureM()
  $("#model").attr("src",model);
  img.forEach(ele=>{
    getFigure(ele.type)
    let color = type_color[ele.type]
    const element = ele.imgT.find((elem) =>elem.color === color)
    $(`#model-${ele.type}`).attr("src",`${element[posImg]}`);
    $(`#model-${ele.type}`).css("margin-top",`${topM}px`);
    $(`#model-${ele.type}`).css("margin-left",`${leftM}px`);
    $('.size').text(`${size}`);
  })
}

// A $( document ).ready() block.
$( document ).ready(function() {
  onClickModel()
});

$(".list-products").on('click','.clickable',function(){
  var $box = $(this).find("input")
  var href = $(this).find("a").attr('href')
  var url = href.replace('detail','product-detail');
  
  if ($box.is(":checked"))
  {
    $box.prop("checked", false);
    getProduct(url,"remove")
  }else{
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    $(group).prop("checked", false);
    $box.prop("checked", true);
    getProduct(url,"add")
  }
})
$(".product-selected-list").on('click','.btn-color',function(){
  var $box = $(this);
  var color = $box.attr('id')
  var type = $box.attr('value')
  type_color[type] = color
  let ele = img.find((elem) => elem.type === type)
  let elem = ele.imgT.find((element) => element.color === color)
  $(`#model-${type}`).attr("src",`${elem[posImg]}`);
})
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
var getProduct = (_url,type) =>{
    $.ajax({
      method: "GET",
      url: _url,
    })
    .done(function( data ) {
      if(type == "add")
      {
        addList(data)
        changeClothe(data)
        const index = img.findIndex((ele) => ele.type === data.type);
        if ( index === -1) {
          img.push({type:data.type,imgT: data.toTryImg})
        } else {
          img[index].imgT = data.toTryImg
        }
        type_color[data.type] = data.toTryImg[0].color
      }
      else if(type == "remove"){
        removeFromList(data)
      }
    });
}
var removeFromList = (product) =>{
  var type = product.type
  $(`#model-${type}`).css("display","none"); 
  $(`.${product.type}`).remove();
  var a = $('.product-selected-list').children();
  priceM[product.type] = 0
  total = priceM["skirt"]+priceM["shirt"]+priceM["short"]+priceM["dress"]
  $.ajax({
    method: "GET",
    url: `/format/${total}`,
  })
  .done(function( data ) {
    $('.total-price').html(`${data}<u>đ</u>`);
  });
  if (a.length == 0){
    $('.total').css("display","none")
  }
}
var changeClothe = (product) =>{
  getFigureM()
  $(`#model-${product.type}`).attr("src",`${product.toTryImg[0][posImg]}`);
  getFigure(product.type);
  $(`#model-${product.type}`).css("margin-top",`${topM}px`);
  $(`#model-${product.type}`).css("margin-left",`${leftM}px`);
  $(`#model-${product.type}`).css("display","flex");
}
var addList = (product) =>{
    getFigureM()
    let s = ''
    for( let i = 0; i< product.toTryImg.length; i++) {
      s += `<button 
              type="button" class="btn btn-default btn-color" 
              id=${product.toTryImg[i].color}
              value=${product.type}
              style="background-color:${product.toTryImg[i].color};"
            />`
    }
    var item = `<div class="product ${product.type}">
                  <h4 class="name">${product.name}</h4>
                  <h4 class="size model-size">${size}</h4>
                  <h4 class="price">${product.price}<u>đ</u></h4>
                  ${s}
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input select-product" checked id="${product.type}">
                    <label class="custom-control-label" for="${product.type}"></label>
                  </div>
                </div>`
    $( `.${product.type}` ).remove();
    $('.product-selected-list').append(item)
    var price = product.price.replace(/,/g,'');
    priceM[product.type] = parseInt(price)
    total = priceM["skirt"]+priceM["shirt"]+priceM["short"]+priceM["dress"]
    $.ajax({
      method: "GET",
      url: `/format/${total}`,
    })
    .done(function( data ) {
      $('.total-price').html(`${data}<u>đ</u>`);
      $('.total').css("display","flex")
    });
    $('.total-price').html(`${total}<u>đ</u>`);
    $('.total').css("display","flex")
    if(product.type == "dress"){
      $("input:checkbox#skirt").prop("checked", false);
      $("input:checkbox#shirt").prop("checked", false);
      $("input:checkbox#short").prop("checked", false);
      $(`#model-shirt`).css("display","none");
      $(`#model-skirt`).css("display","none");
      $(`#model-short`).css("display","none");
    }
    if(product.type == "shirt"){
      $("input:checkbox#dress").prop("checked", false);
      $(`#model-dress`).css("display","none");
    }
    if(product.type == "skirt"){
      $("input:checkbox#dress").prop("checked", false);
      $(`#model-dress`).css("display","none");
      $("input:checkbox#short").prop("checked", false);
      $(`#model-short`).css("display","none");
    }
    if(product.type == "short"){
      $("input:checkbox#dress").prop("checked", false);
      $(`#model-dress`).css("display","none");
      $("input:checkbox#skirt").prop("checked", false);
      $(`#model-skirt`).css("display","none");
    }

}