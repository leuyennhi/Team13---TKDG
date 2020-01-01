var ObjectId = require('mongodb').ObjectID;
var Product = require('../models/products');
var Category = require('../models/catergories');
var User = require('../models/users');
var Review = require('../models/reviews');
var createQueryHelper = require('../helpers/create-query-url.helper');
var formatPriceHelper = require('../helpers/format-price.helper');

var breadcrumbs_middleware = require('../middlewares/breadcrumbs.middleware');

const price = [
  { start: 0, end: 500000 },
  { start: 500000, end: 1000000 },
  { start: 1000000, end: 1500000 },
  { start: 1500000, end: 2000000 },
  { start: 2000000, end: 2500000 },
  { start: 2500000, end: 3000000 },
  { start: 3000000, end: 4000000 },
  { start: 4000000, end: 1000000000 }
];
const color = [
  'Đen',
  'Trắng',
  'Nâu',
  'Xanh',
  'Đỏ',
  'Vàng',
  'Cam',
  'Hồng',
  'Tím',
  'Xám'
];
const size = ['S', 'M', 'L', 'XL', 'Freesize'];

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
}

var async = require('async');
exports.index = function(req, res) {
  res.locals.isShowBreadcrumbs = false;
  var itemPerPage = 12;
  page = req.params.page ? req.params.page : 1;
  async.parallel(
    {
      products: function(callback) {
        Product.find()
          .skip(itemPerPage * page - itemPerPage)
          .limit(itemPerPage)
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      },
      pageCount: function(callback) {
        Product.countDocuments().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      var pageNum = Math.ceil(results.pageCount / itemPerPage);
      var page = [];
      for (var i = 1; i <= pageNum; i++) {
        page.push(i);
      }
      results.products.forEach(ele => {
        ele.img = ele.img[0];
        ele.salePercent = Math.ceil(
          (1 - (ele.price * 1.0) / ele.originalPrice) * 100
        );
      });
      var linkPage = '/page';
      res.render('products/home', {
        title: 'Trang chủ',
        // linkPage: linkPage,
        // page: page,
        products: results.products,
        categories: results.categories,
        user: req.user
      });
    }
  );
};

exports.search_products = function(req, res, next) {
  res.locals.isShowBreadcrumbs = false;
  var quantityPerPage = 12;
  var productName = req.query.productName || '';
  var pageNumber = req.query.pageNumber || 1;
  var isFound = true;

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }
  productName = productName.trim().toLowerCase();

  async.parallel(
    {
      products: function(callback) {
        Product.find({
          name: { $regex: new RegExp('.*' + productName + '.*', 'i') }
        })
          .skip(quantityPerPage * (pageNumber - 1))
          .limit(quantityPerPage)
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      },
      productQuantity: function(callback) {
        Product.countDocuments({
          name: { $regex: new RegExp('.*' + productName + '.*', 'i') }
        }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }

      var pageQuantity = Math.ceil(results.productQuantity / quantityPerPage);
      var pageNumbers = [];
      for (var i = 1; i <= pageQuantity; i++) {
        var pageNum = { active: pageNumber == i ? true : false, value: i };
        pageNumbers.push(pageNum);
      }

      if (results.products == 0) {
        isFound = false;
        searchMessage = `Không tìm thấy sản phẩm phù hợp với từ khóa "${productName}"`;
      } else {
        searchMessage = `${results.productQuantity} kết quả tìm kiếm phù hợp với từ khóa "${productName}"`;
      }

      results.products.forEach(product => {
        product.img = product.img[0];
      });

      res.render('products/search', {
        title: 'Tìm kiếm sản phẩm',
        pageNumbers: pageNumbers,
        products: results.products,
        categories: results.categories,
        searchMessage: searchMessage,
        isFound: isFound,
        productName: productName,
        user: req.user,
        helpers: {
          createQueryProductSearch: createQueryHelper.createQueryProductSearch
        }
      });
    }
  );
};

exports.product_list_by_category = function(req, res) {
  var categoryId = req.params.categoryId || '';
  var productName = req.params.productName || '';
  if (productName === 'all') productName = '';
  productName = productName.trim().toLowerCase();

  Product.find({
    name: { $regex: new RegExp('.*' + productName + '.*', 'i') },
    catergory: ObjectId(categoryId)
  })
    .then(products => {
      var listProducts = JSON.parse(JSON.stringify(products));
      listProducts.forEach(product => {
        product.img = product.img[0];
        product.price = formatPriceHelper(product.price);
        product.originalPrice = formatPriceHelper(product.originalPrice);
        product.salePercent = Math.ceil(
          (1 - (product.price * 1.0) / product.originalPrice) * 100
        );
      });

      return res.json({ error: false, data: listProducts });
    })
    .catch(error => res.json({ error: true, data: error }));
};

exports.home_search_post = function(req, res) {
  if (req.body.search == '') {
    res.redirect('/');
  }
  res.redirect('/search/' + req.body.search + '/1');
};
exports.home_search_get = function(req, res) {
  var itemPerPage = 12;
  page = req.params.page ? req.params.page : 1;
  async.parallel(
    {
      products: function(callback) {
        Product.find({
          name: { $regex: new RegExp('.*' + req.params.search + '.*', 'i') }
        })
          .skip(itemPerPage * page - itemPerPage)
          .limit(itemPerPage)
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      },
      pageCount: function(callback) {
        Product.countDocuments({
          name: { $regex: new RegExp('.*' + req.params.search + '.*', 'i') }
        }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      var pageNum = Math.ceil(results.pageCount / itemPerPage);
      var page = [];
      for (var i = 1; i <= pageNum; i++) {
        page.push(i);
      }
      var notfound = null;
      var found = null;
      if (results.products == 0) {
        notfound =
          'Không tìm thấy sản phẩm phù hợp với từ khóa "' +
          req.params.search +
          '".';
      } else {
        found = 'Các sản phẩm phù hợp với từ khóa "' + req.params.search + '".';
      }
      results.products.forEach(ele => {
        ele.img = ele.img[0];
      });
      var linkPage = '/search/' + req.params.search;
      res.render('products/home', {
        title: 'Sản Phẩm',
        linkPage: linkPage,
        page: page,
        products: results.products,
        categories: results.categories,
        none: notfound,
        done: found,
        textSearch: req.body.search,
        user: req.user
      });
    }
  );
};

exports.home_filtermulti = function(req, res) {
  if (
    req.body.color == '0' &&
    req.body.size == '0' &&
    req.body.price == '0' &&
    req.body.category == 'a'
  ) {
    return res.redirect('/');
  }

  async.parallel(
    {
      products: function(callback) {
        Product.find().exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }
      var temp = results.products;
      var productList = [];
      if (req.body.color !== '0') {
        productList = temp.filter(
          item => item.color === color[parseInt(req.body.color) - 1]
        );
        temp = productList;
      }
      if (req.body.size !== '0') {
        productList = temp.filter(
          item => item.size === size[parseInt(req.body.size) - 1]
        );
        temp = productList;
      }
      if (req.body.category !== 'a') {
        productList = temp.filter(item =>
          item.catergory.equals(
            results.categories[parseInt(req.body.category)]._id
          )
        );
        temp = productList;
      }
      if (req.body.price !== '0') {
        productList = temp.filter(
          item =>
            item.price >= price[parseInt(req.body.price) - 1].start &&
            item.price <= price[parseInt(req.body.price) - 1].end
        );
      }
      productList.forEach(ele => {
        ele.img = ele.img[0];
      });
      var notfound = null;
      var found = null;
      if (productList == 0) {
        notfound = 'Không tìm thấy sản phẩm phù hợp với bộ lọc.';
      } else {
        found = 'Các sản phẩm phù hợp với bộ lọc.';
      }
      res.locals.amountproduct = req.session.amountproduct;
      res.render('products/home', {
        title: 'Trang chủ',
        size: req.body.size,
        color: req.body.color,
        price: req.body.price,
        category: req.body.category,
        products: productList,
        categories: results.categories,
        none: notfound,
        done: found,
        textSearch: req.body.search,
        user: req.user
      });
    }
  );
};
exports.product_list = function(req, res) {
  res.locals.isShowBreadcrumbs = true;
  res.locals.links.push({ name: 'Trang chủ', route: '/' });
  res.locals.links.push({ name: 'Sản phẩm', route: '/product' });

  var quantityPerPage = 12;
  var pageNumber = req.query.pageNumber || 1;

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  async.parallel(
    {
      products: function(callback) {
        Product.find()
          .skip(quantityPerPage * pageNumber - quantityPerPage)
          .limit(quantityPerPage)
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      },
      productQuantity: function(callback) {
        Product.countDocuments().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }

      var pageQuantity = Math.ceil(results.productQuantity / quantityPerPage);
      var pageNumbers = [];
      for (var i = 1; i <= pageQuantity; i++) {
        var pageNum = { active: pageNumber == i ? true : false, value: i };
        pageNumbers.push(pageNum);
      }

      results.products.forEach(ele => {
        ele.img = ele.img[0];
        ele.salePercent = Math.ceil(
          (1 - (ele.price * 1.0) / ele.originalPrice) * 100
        );
      });

      res.render('products/product', {
        title: 'Sản phẩm',
        pageNumbers: pageNumbers,
        products: results.products,
        categories: results.categories,
        user: req.user
      });
    }
  );
};
exports.product_detail = async function(req, res) {
  var itemPerPage = 10;
  page = req.params.page ? req.params.page : 1;
  var product = await Product.findById(req.params.id);
  if (!product.watch) {
    product.watch = 1;
  } else {
    product.watch = product.watch + 1;
  }
  await product.save();
  product.bought = product.bought || 0;
  res.locals.isShowBreadcrumbs = true;
  res.locals.links.push({ name: 'Trang chủ', route: '/' });
  res.locals.links.push({ name: 'Sản phẩm', route: '/product' });
  res.locals.links.push({ name: product.name, route: '#' });
  async.parallel(
    {
      category: function(callback) {
        Category.findById(product.catergory).exec(callback);
      },
      productRelate: function(callback) {
        Product.find({ catergory: product.catergory })
          .limit(4)
          .exec(callback);
      },
      reviewPage: function(callback) {
        Review.countDocuments({ product: product._id }).exec(callback);
      },
      review: function(callback) {
        Review.find({ product: product._id })
          .skip(itemPerPage * page - itemPerPage)
          .limit(itemPerPage)
          .exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      var pageNum = Math.ceil(results.reviewPage / itemPerPage);
      var page = [];
      for (var i = 1; i <= pageNum; i++) {
        page.push(i);
      }
      results.productRelate.forEach(ele => {
        ele.img = ele.img[0];
        ele.salePercent = Math.ceil(
          (1 - (ele.price * 1.0) / ele.originalPrice) * 100
        );
      });

      var filteredResult = results.review.filter(function(ele) {
        return ele.star === 5;
      });
      filteredResult.forEach(review => {
        review.formatDate = formatDate(new Date(review.date));
        review.reply.forEach(element => {
          element.formatDate = formatDate(new Date(element.date));
        });
      });

      res.render('products/product-detail', {
        title: 'Chi tiết mặt hàng',
        item: product,
        category: results.category,
        productRelates: results.productRelate,
        user: req.user,
        reviews: filteredResult,
        num: results.reviewPage,
        page: page,
        watch: product.watch
      });
    }
  );
};

exports.product_search_post = function(req, res) {
  if (req.body.search == '') {
    res.redirect('/product');
  }

  res.redirect('/product/search/' + req.body.search + '/1');
};

exports.product_filtermulti = function(req, res) {
  if (
    req.body.color == '0' &&
    req.body.size == '0' &&
    req.body.price == '0' &&
    req.body.category == 'a'
  ) {
    return res.redirect('/product');
  }

  async.parallel(
    {
      products: function(callback) {
        Product.find().exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }
      var temp = results.products;
      var productList = [];
      if (req.body.color !== '0') {
        productList = temp.filter(
          item => item.color === color[parseInt(req.body.color) - 1]
        );
        temp = productList;
      }
      if (req.body.size !== '0') {
        productList = temp.filter(
          item => item.size === size[parseInt(req.body.size) - 1]
        );
        temp = productList;
      }
      if (req.body.category !== 'a') {
        productList = temp.filter(item =>
          item.catergory.equals(
            results.categories[parseInt(req.body.category)]._id
          )
        );
        temp = productList;
      }
      if (req.body.price !== '0') {
        productList = temp.filter(
          item =>
            item.price >= price[parseInt(req.body.price) - 1].start &&
            item.price <= price[parseInt(req.body.price) - 1].end
        );
      }
      productList.forEach(ele => {
        ele.img = ele.img[0];
      });
      var notfound = null;
      var found = null;
      if (productList == 0) {
        notfound = 'Không tìm thấy sản phẩm phù hợp với bộ lọc.';
      } else {
        found = 'Các sản phẩm phù hợp với bộ lọc.';
      }
      res.locals.amountproduct = req.session.amountproduct;
      res.render('products/product', {
        title: 'Sản phẩm',
        size: req.body.size,
        color: req.body.color,
        price: req.body.price,
        category: req.body.category,
        products: productList,
        categories: results.categories,
        none: notfound,
        done: found,
        textSearch: req.body.search,
        user: req.user
      });
    }
  );
};

exports.product_search_get = function(req, res) {
  var itemPerPage = 12;
  page = req.params.page ? req.params.page : 1;
  async.parallel(
    {
      products: function(callback) {
        Product.find({
          name: { $regex: new RegExp('.*' + req.params.search + '.*', 'i') }
        })
          .skip(itemPerPage * page - itemPerPage)
          .limit(itemPerPage)
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      },
      pageCount: function(callback) {
        Product.countDocuments({
          name: { $regex: new RegExp('.*' + req.params.search + '.*', 'i') }
        }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      var pageNum = Math.ceil(results.pageCount / itemPerPage);
      var page = [];
      for (var i = 1; i <= pageNum; i++) {
        page.push(i);
      }
      var notfound = null;
      var found = null;
      if (results.products == 0) {
        notfound =
          'Không tìm thấy sản phẩm phù hợp với từ khóa "' +
          req.params.search +
          '".';
      } else {
        found = 'Các sản phẩm phù hợp với từ khóa "' + req.params.search + '".';
      }
      results.products.forEach(ele => {
        ele.img = ele.img[0];
      });
      var linkPage = '/product/search/' + req.params.search;
      res.render('products/product', {
        title: 'Sản Phẩm',
        linkPage: linkPage,
        page: page,
        products: results.products,
        categories: results.categories,
        none: notfound,
        done: found,
        textSearch: req.body.search,
        user: req.user
      });
    }
  );
};
exports.product_sort_home = function(req, res) {
  var s = req.params.type == 'asc' ? 1 : -1;
  async.parallel(
    {
      products: function(callback) {
        Product.find()
          .sort({ price: s })
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      results.products.forEach(ele => {
        ele.img = ele.img[0];
      });
      res.render('products/home', {
        title: 'Trang chủ',
        products: results.products,
        categories: results.categories,
        user: req.user
      });
    }
  );
};

exports.product_sort = function(req, res) {
  var s = req.params.type == 'asc' ? 1 : -1;
  async.parallel(
    {
      products: function(callback) {
        Product.find()
          .sort({ price: s })
          .exec(callback);
      },
      categories: function(callback) {
        Category.find().exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      results.products.forEach(ele => {
        ele.img = ele.img[0];
      });
      res.render('products/product', {
        title: 'Sản phẩm',
        products: results.products,
        categories: results.categories,
        user: req.user
      });
    }
  );
};

exports.product_add_to_cart = function(req, res) {
  var num = 0;
  if (!req.user) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    var i = req.session.cart.findIndex(item => item.product == req.params.id);
    if (i > -1) {
      req.session.cart[i].amount =
        parseInt(req.session.cart[i].amount) + parseInt(req.body.num);
    } else {
      req.session.cart.push({ product: req.params.id, amount: req.body.num });
    }
    num = parseInt(req.body.num);
  } else {
    if (req.user.cart == null) {
      User.findByIdAndUpdate(req.user._id, { cart: [] });
    }
    var i = req.user.cart.findIndex(item => item.product == req.params.id);
    num = parseInt(req.body.num);

    if (i > -1) {
      num += parseInt(req.user.cart[i].amount);
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart: { product: req.params.id } } },
        { multi: true },
        function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        }
      );
    }
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { cart: [{ product: req.params.id, amount: num }] } },
      { safe: true, upsert: true },
      function(err, doc) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  req.session.amountproduct += num;
  res.redirect('/product/detail/' + req.params.id);
};

exports.product_review = async function(req, res) {
  var review = new Review({
    name: req.body.name,
    content: req.body.review,
    product: req.params.id,
    star: req.body.rating
  });
  await review.save();
  res.redirect('/product/detail/' + req.params.id);
};
