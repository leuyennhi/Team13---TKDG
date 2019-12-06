var Product = require('../models/products');
var Category = require('../models/catergories');
var async = require('async');
var engCat = {"Áo":"shirt","Chân Váy":"skirt", "Đầm":"dress"}

var products = undefined
var catergories = undefined
exports.try_clothe = async function(req, res) {
  var result = await Product.find()
  var resultCat = await Category.find()
  if (result) {
    var result1 = await Category.findOne({name:'Áo'})
    var result2 = await Category.findOne({name:'Chân Váy'})
    var result3 = await Category.findOne({name:'Đầm'})
    result.forEach(ele => {
      ele.img = ele.img[0];
    });
    products = result;
    catergories = resultCat;

    var products1 = result.filter(ele=>ele.catergory == result1.id)
    var products2 = result.filter(ele=>ele.catergory == result2.id)
    var products3 = result.filter(ele=>ele.catergory == result3.id)

    
    res.render('tryclothe/index', {
      title: 'Thử đồ',
      productList1: products1,
      productList2: products2,
      productList3: products3,

    })
  }
}


exports.product_detail_data = async function(req, res) {
  const { id } = req.params
  var product = products.find(ele=> ele.id == req.params.id);
  var catergory = catergories.find( ele => ele.id == product.catergory)
  product.type = engCat[catergory.name]
  res.json(product)
};
