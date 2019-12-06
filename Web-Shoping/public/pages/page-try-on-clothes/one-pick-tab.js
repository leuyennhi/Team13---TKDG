// the selector will match all input controls of type :checkbox
// and attach a click event handler 
$("input:checkbox.tab").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
    var href = $(this).parent().parent().find("a").attr('href')
    var url = href.replace('detail','product-detail');
    getProduct(url)
  });

  var getProduct = (_url) =>{
    console.log(_url)
    $.ajax({
      method: "GET",
      url: _url,
    })
    .done(function( data ) {
       console.log(data)
    });
  }
  var changeClothe = () =>{

  }
  var addList = (type,product) =>{
    var item = `<div class="product ${type}">
                  <h4 class="name">Áo Dây Croptop Trắng Phối Ren1</h4>
                  <h4 class="size">S</h4>
                  <h4 class="price">285,000đ</h4>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck-${type} checked">
                    <label class="custom-control-label" for="customCheck-${type}"></label>
                  </div>
                </div>`
    $( `.${type}` ).remove();
    $('.selected-products').append(item)
  }