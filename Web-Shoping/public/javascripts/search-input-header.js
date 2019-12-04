//Tìm kiếm
$('#btn_search').click(function() {
  var inputProductName = $('#product_name').val();
  var page = 1;

  var query = CreateQuery(inputProductName, page);
  var base_url =
    location.protocol + '//' + document.domain + ':' + location.port;
  if (query != '') {
    //Chuyển trang
    window.location = base_url + `/search-products?${query}`;
  } else {
    window.location = base_url + `/`;
  }
});

function CreateQuery(name, page) {
  var data = {
    productName: name,
    pageNumber: page
  };

  return encodeQueryData(data);
}

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    if (data[d] != 0) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  return ret.join('&');
}
