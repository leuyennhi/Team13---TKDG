var Category = require('../models/catergories');
var Product = require('../models/products');
var async = require('async');



  exports.products_list = function(req, res){
    Product.find({},function(err,result){
      if(err){return console.log(err);} 
      res.render('products/products', { title: 'Quản lý sản phẩm',cattitle:'Quản lý sản phẩm',admin:req.user, list_products: result});
    });
  };


  exports.products_list_cat = function(req, res, next){
    var category="";
    Category.findOne({_id:req.params.id},{ _id:0, name: 1}).exec().then((result) => {
      category=result['name'];
      Product.find({'catergory':req.params.id},function(err,result){
        if(err){return console.log(err);} 
        console.log(category);
        console.log("finish");
        res.render('products/products', { title: 'Quản lý sản phẩm',list_products: result, cattitle:'Sản phẩm thuộc loại', admin:req.user, categoryName: category});
      });
    });
  };
  
  exports.products_create = function(req, res) {
    Category.find()
            .exec(function(err, results) {
              if (err) { return console.log(err); }
              res.render('products/products_create', { title: 'Thêm sản phẩm',catergories:results, admin:req.user});
            });
  };
  
  
  exports.products_create_post = function(req, res) {
    Product.findOne({'name':req.body.name}, function(err, found){
      if(err){return console.log(err)};
      if(found){
        res.redirect('/products');
      }else{
        if(req.body.price<10000)
          return res.render("products/products_create",{title:"Thêm sản phẩm",message:"Giá tiền phải lớn hơn 10.000 VND",admin:req.user});
        if(req.body.amount<=0)
          return res.render("products/products_create",{title:"Thêm sản phẩm",message:"Chưa có kích cỡ",admin:req.user});
        if(req.files.length>4)
          return res.render("products/products_create",{title:"Thêm sản phẩm",message:"Không được thêm quá 4 hình",admin:req.user});
        if(req.body.size<0)
          return res.render("products/products_create",{title:"Thêm sản phẩm",message:"Kích cỡ phải lớn hơn 0",admin:req.user});
        if(req.body.amount<0)
          return res.render("products/products_create",{title:"Thêm sản phẩm",message:"Số lượng phải lớn hơn 0",admin:req.user});

          var product = new Product(
          { name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            size: req.body.size,
            color:req.body.color,
            description:req.body.descript,
            catergory: req.body.category
          });
          req.files.forEach(ele=>{
            product.img.push(ele.url);
          })
          product.save(function (err) {
            if (err) { return console.log(err); }
            res.redirect('/products/create');
          });
      }
    })
  }
  

  exports.products_delete = function(req, res) {
    Product.findOne({'_id':req.params.id},function(err,result){
      if(err){return console.log(err);} 
      res.render('products/products_delete', { title: 'Xóa sản phẩm',product:result, admin:req.user});
    });
  };

  exports.products_delete_post = function(req, res) {
    Product.deleteOne({'_id':req.params.id})
          .exec(function(err,result){
            if(err){return console.log(err);}
            res.redirect('/products');
          })
  };

  exports.products_update = function(req, res) {
    Product.findOne({'_id':req.params.id})
          .exec(function(err,result){
            if(err){return console.log(err);}
            Category.find()
                    .exec(function(err,result1){
                        if(err){return console.log(err);}
                        res.render('products/products_update', { title: 'Chỉnh sửa sản phẩm',admin:req.user, product:result,catergories:result1});
                    });
          })
    
  };
 
  exports.products_update_post = function(req, res) {
      req.body.img = [];
      if(req.body.img != []){
        req.files.forEach(ele=>{
          req.body.img.push(ele.url);
        })
      }
      Product.findByIdAndUpdate(req.params.id,req.body)
      .exec(function(err,result){
        if(err){return console.log(err);}
        res.redirect('/products');
      });
  };

  exports.products_getdetail = async function(req,res) {
    var result = await Product.findById(req.params.id);
    var result2 = await Category.findById(result.catergory);
    res.render('products/products_detail', { title: 'Chỉnh sửa sản phẩm',img:result.img[0],product: result, category: result2, admin:req.user});
  };