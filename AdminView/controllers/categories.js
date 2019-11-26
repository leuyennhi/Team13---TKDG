var Category = require('../models/catergories');
var Product = require('../models/products');
var async = require('async');



exports.categories_list = async function(req, res){
  var result = await Category.find();
  const result1 = await Promise.all(result.map(async ele=>{return await Product.countDocuments({'catergory': ele._id});}));
  
  for(var i = 0;i<result.length;i++){
    result[i].amount = result1[i];
  }

  res.render('categories/categories', { title: 'Quản lý gian hàng',list_categories: result, admin:req.user});
};


exports.categories_create = function(req, res) {
  res.render('categories/categories_create', { title: 'Thêm gian hàng', admin:req.user});
};


exports.categories_create_post = function(req, res) {
  Category.findOne({ 'name': req.body.name })
          .exec( function(err, found_category) {
              if (err) { return next(err); }
              if (found_category) {
                  res.redirect('/categories');
              }
              else {
                category = new Category({
                  name: req.body.name,
                });
                category.save(function (err) {
                if (err) { return next(err); }
                res.redirect('/categories');
              });
            }
    });
};


exports.categories_delete = async function(req, res) {
  var found_category = await Category.findOne({'_id': req.params.id})
  res.render('categories/categories_delete', { title: 'Xóa loại hàng',category:found_category, admin:req.user});
};

exports.categories_delete_post = async function(req, res) {
  await Category.deleteOne({'_id':req.params.id})
  res.redirect('/categories');
};


exports.categories_update = async function(req, res) {
  var found_category = await Category.findOne({'_id': req.params.id})
  res.render('categories/categories_update', { title: 'Cập nhật loại hàng',category:found_category, admin:req.user});
};


exports.categories_update_post = async function(req, res) {
  await Category.findByIdAndUpdate(req.params.id,req.body);
  res.redirect('/categories');
};

