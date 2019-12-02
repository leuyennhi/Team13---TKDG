var Product = require('../models/products');
var Category = require('../models/catergories');
var async = require('async');

exports.try_clothe = function(req, res) {
  async.parallel(
    {
      products: function(callback) {
        Product.find()
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
      res.render('tryclothe/index', {
        title: 'Thử đồ',
        products: results.products,
        categories: results.categories,
        user: req.user
      });
    }
  );
};