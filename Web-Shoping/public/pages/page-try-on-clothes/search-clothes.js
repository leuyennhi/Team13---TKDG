//Tìm kiếm
$('.btn-search-products').click(function() {
  var inputSearch = $(this)
    .parent('div')
    .prev('input');
  var productName = inputSearch.val();
  var categoryId = inputSearch.attr('data-category');

  if (productName != undefined && categoryId != undefined) {
    productName = productName.trim();
    if (productName === '') productName = 'all';

    $.ajax({
      type: 'POST',
      url: `/product/${categoryId}/${productName}`,
      success: function(result) {
        if (!result.error) {
          var listProducts = inputSearch
            .parent('div')
            .next('div.list-products');
          var productItems = [];

          for (product of result.data) {
            var item = `<div class="component-checkable-product card mr-2 clickable">
                <div class="product-image">
                    <img data-toggle="tooltip" title="${product.name}" src="${product.img}" alt="" />
                    <a href="/product/detail/${product._id}" class="stretched-link"></a>
                </div>
                <div class="card-body">
                    <div>
                        <a href="/product/detail/${product._id}" class="card-title m-0">${product.name}</a>
                        <div class="m-0 mt-1 d-flex">
                            <span class="sale-price">${product.price}<u>đ</u></span>
                            <span class="original-price ml-3">
                                ${product.originalPrice}<u>đ</u>
                            </span>
                        </div>
                    </div>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input tab" name="${product.catergory}"
                            id="customCheck${product._id}-1">
                        <label class="custom-control-label" for="customCheck${product._id}-1"></label>
                    </div>
                </div>
            </div>`;

            productItems.push(item);
          }

          listProducts.empty();
          listProducts.append(productItems);
        } else {
        }
      }
    });
  }
});
