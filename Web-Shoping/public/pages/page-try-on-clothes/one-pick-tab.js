
var img = []
var topM = 0
var leftM = 0
var model = ""
var posImg = -1
var size = ""
var getFigureM = ()=>{
  var x = document.getElementById("height").value;
  var y = document.getElementById("waist").value;

  model = "/images/Models/2.png";
  posImg = 1;
  size = "S"
  if (y>80){
   model = "/images/Models/3.png";
   posImg = 2;
   size = "L"
  }
  else if (x>170){
    model = "/images/Models/1.png";
    posImg = 0
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
            leftM = -5
          }
          else if (x>170){
            topM = 105
            leftM = -4
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
    $(`#model-${ele.type}`).attr("src",`${ele.imgT[posImg]}`);
    $(`#model-${ele.type}`).css("top",`${topM}px`);
    $(`#model-${ele.type}`).css("left",`${leftM}px`);
  })
}

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
       img.push({type:data.type,imgT: data.toTryImg})
    });
}
var changeClothe = (product) =>{
  getFigureM()
  $(`#model-${product.type}`).attr("src",`${product.toTryImg[posImg]}`);
  getFigure(product.type);
  console.log(topM)
  $(`#model-${product.type}`).css("top",`${topM}px`);
  $(`#model-${product.type}`).css("left",`${leftM}px`);
  $(`#model-${product.type}`).css("display","flex");
}
var addList = (product) =>{
    getFigureM()
    var item = `<div class="product ${product.type}">
                  <h4 class="name">${product.name}</h4>
                  <h4 class="size">${size}</h4>
                  <h4 class="price">${product.price}<u>đ</u></h4>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input select-product" checked id="${product.type}">
                    <label class="custom-control-label" for="${product.type}"></label>
                  </div>
                </div>`
    $( `.${product.type}` ).remove();
    $('.product-selected-list').append(item)
    $('.selected-products button').css("display","block")
    if(product.type == "dress"){
      $("input:checkbox#skirt").prop("checked", false);
      $("input:checkbox#shirt").prop("checked", false);
      $(`#model-shirt`).css("display","none");
      $(`#model-skirt`).css("display","none");
    }
}