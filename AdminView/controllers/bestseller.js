var Category = require('../models/catergories');
var Product = require('../models/products');
var Order = require('../models/orders');
var async = require('async');

exports.bestseller_list = async function(req, res, next) {
  var temp=null;
  var list_products = await Order.aggregate(
    [
      {
        $match: {
        status: 'Đã nhận',
      }
    },
      {
        $unwind: "$products"
     },
     {
        $replaceRoot: { newRoot: "$products"}
     },
      {
        $group : {
          _id : '$product',
          total: { $sum: '$amount' },
        }
      }, 
    ]
 ).sort({total:-1}).limit(10)
    temp = list_products;
    await Promise.all(temp.map(async element => {
      var result = await Product.findOne({_id:element._id},{ _id:0, name: 1, catergory:1})
      element.name = result.name;
      element.category =result.catergory.toString();
      var result2 = await Category.findOne({_id:element.category},{ _id:0, name: 1})
      element.categoryName = result2.name;
  }))
  res.render('bestseller/bestseller', { title: 'Sản phẩm bán chạy',list_bestSeller: temp, admin:req.user});
}
/*
exports.bestseller_list = async function(req, res, next) {
  var temp=null;
  await Order.aggregate(
    [
      {
        $unwind: "$products"
     },
     {
        $replaceRoot: { newRoot: "$products"}
     },
      {
        $group : {
          _id : '$product',
          total: { $sum: '$amount' },
        }
      }, 
    ]
 ).sort({total:-1}).exec().then(async (list_products) => {
  //if(err){return next(err);}
  setTimeout(function(){
    //console.log(temp);
    res.render('bestseller/bestseller', { title: 'Sản phẩm bán chạy',list_bestSeller: temp});
  },10000);
  temp = await list_products;
  await temp.forEach( element => {
    return Product.findOne({_id:element._id},{ _id:0, name: 1, catergory:1}).exec().then((result) => {
      element['name'] = result['name'];
      element['category']=result['catergory'];
      console.log("123456");
    }).catch((err) => {
      console.log(err);
    });

  });
  await temp.forEach( element => {
    console.log(temp);
    return Category.findOne({_id:element.category},{ _id:0, name: 1}).exec().then((result) => {
      element['categoryName']=result['name'];
      console.log("789");
    }).catch((err) => {
      console.log(err);
    });

  });
}).catch((err) => {
  console.log(err);
});
};
/*  
// Create a Book object with escaped and trimmed data.
  var order = new Order(
    { 
      custom: "5cda6c6856726144cd5f4581",
      day: new Date("2019-05-10"),
      status: "Đã nhận",
      address:"Q.7, tp.Hồ Chí Minh",
      products: [{product: "5cd45131a1fb092e88637890",amount:2},{product:"5cd4519fa1fb092e88637891",amount:2},{product: "5cd45295a1fb092e88637895",amount:1}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
    //2
    order = new Order(
      { 
        custom: "5cda6c6856726144cd5f4581",
        day: new Date("2019-05-10"),
        status: "Đã hủy",
        address:"Q.7, tp.Hồ Chí Minh",
        products: [{product:"5cd452cea1fb092e88637896",amount:2},{product:"5cd4519fa1fb092e88637891",amount:2},{product:"5cd4544ea1fb092e8863789b",amount:1}],
      });
          // Data from form is valid. Save book.
      order.save(function (err) {
        if (err) { return next(err); }
      });
    //3
    order = new Order(
      { 
        custom: "5cda72dce26c2f49ab697ec0",
        day: new Date("2019-05-12"),
        status: "Đã nhận",
        address:"Q.8, tp.Hồ Chí Minh",
        products: [{product:"5cd45626a1fb092e8863789d",amount:5},{product:"5cd453e4a1fb092e8863789a",amount:4}],
      });
          // Data from form is valid. Save book.
      order.save(function (err) {
        if (err) { return next(err); }
      });
  //4
    order = new Order(
    { 
      custom: "5cda7f84b641284fc2e0309a",
      day: new Date("2019-04-01"),
      status: "Đã nhận",
      address:"Q.Tân Bình, tp.Hồ Chí Minh",
      products: [{product:"5cd458f9a1fb092e8863789f",amount:1},{product:"5cd45b8ca1fb092e886378a0",amount:1},{product:"5cd4519fa1fb092e88637891",amount:2}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //5
    order = new Order(
    { 
      custom: "5cda7f84b641284fc2e0309a",
      day: new Date("2019-05-01"),
      status: "Đã nhận",
      address:"Q.3, tp.Hồ Chí Minh",
      products: [{product:"5cd45131a1fb092e88637890",amount:1},{product:"5cd451d2a1fb092e88637892",amount:2},{product:"5cd4519fa1fb092e88637891",amount:1}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //6
    order = new Order(
    { 
      custom: "5cda7f84b641284fc2e0309a",
      day: new Date("2019-05-15"),
      status: "Đã nhận",
      address:"Q.3, tp.Hồ Chí Minh",
      products: [["5cd45242a1fb092e88637894",1]],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //7
    order = new Order(
    { 
      custom: "5cda72dce26c2f49ab697ec0",
      day: new Date("2019-05-15"),
      status: "Đang giao",
      address:"Q.5, tp.Hồ Chí Minh",
      products: [{product:"5cd45295a1fb092e88637895",amount:1},{product:"5cd452cea1fb092e88637896",amount:1}, {product:"5cd452f5a1fb092e88637897",amount:1},{product:"5cd4533ca1fb092e88637898",amount:2}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //8
  order = new Order(
    { 
      custom: "5cda80426471675293560269",
      day: new Date("2019-05-15"),
      status: "Đang giao",
      address:"Q.10, tp.Hồ Chí Minh",
      products: [{product:"5cd45295a1fb092e88637895",amount:1},{product:"5cd452cea1fb092e88637896",amount:1}, {product:"5cd452f5a1fb092e88637897",amount:1},{product:"5cd4533ca1fb092e88637898",amount:2}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //9
  order = new Order(
    { 
      custom: "5cda80426471675293560269",
      day: new Date("2019-04-15"),
      status: "Đã nhận",
      address:"Q.10, tp.Hồ Chí Minh",
      products: [{product:"5cd458f9a1fb092e8863789f",amount:1}],
    });
        // Data from form is valid. Save book.
    order.save(function (err) {
      if (err) { return next(err); }
    });
  //10
    order = new Order(
      { 
        custom: "5cda80426471675293560269",
        day: new Date("2019-04-22"),
        status: "Đã nhận",
        address:"Q.10, tp.Hồ Chí Minh",
        products: [{product:"5cd45b8ca1fb092e886378a0",amount:1},{product:"5cd451d2a1fb092e88637892",amount:1},{product:"5cd4519fa1fb092e88637891",amount:3},{product:"5cd452cea1fb092e88637896",amount:2}],
      });
          // Data from form is valid. Save book.
      order.save(function (err) {
        if (err) { return next(err); }
      });
    res.render('bestseller/bestseller', { title: 'Sản phẩm bán chạy'});
    */