var Order = require("../models/orders");
var Product = require("../models/products")
var User = require("../models/users");

function formatCost(cost) {
    var result = "";
    var temp = cost.slice(0,cost.length-4);
    temp = temp.split(".");
    for(i=0;i<temp.length;i++) {
        result+=temp[i];
    }
    return parseInt(result);
}
function formatDate(date){
    var dd = date.getDate();
    var mm=date.getMonth()+1;
    var yyyy=date.getFullYear();
    if(dd < 10)
      {
          dd = '0'+ dd;
      }
    if(mm < 10)
    {
        mm = '0' + mm;
    }
    return dd+"/"+mm+"/"+yyyy;
    
  }
exports.cart_list =  async function(req, res) {
    var total = 0;
    var products = [];
    if(!req.user) {

        if(!req.session.cart) {
            return  res.render("cart/shoppingcart", {title: 'Giỏ hàng', total: total, products: products, user:req.user, mess: 'Chưa có sản phẩm nào trong giỏ hàng.'});
        }

        await Promise.all(req.session.cart.map( async element => {
            var result = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, img:1 })
            result.img = result.img[0];
            total+= element.amount*result['price'];
            products.push({productID: element.product, productName: result['name'], productPrice: result['price'], amount: element.amount, img: result['img'], total: element.amount*result['price']});
        }));
    }
    else {
        if( req.user.cart==[]) {
            return res.render("cart/shoppingcart", {title: 'Giỏ hàng', total: total, products: products, user:req.user, mess: 'Chưa có sản phẩm nào trong giỏ hàng.'});
        }
        
        await Promise.all(req.user.cart.map( async element => {
            var result = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, img:1 }) 
            result.img = result.img[0];
            total+= element.amount*result['price'];
            products.push({productID: element.product, productName: result['name'], productPrice: result['price'], amount: element.amount, img: result['img'], total: element.amount*result['price']});
        }));
    }
    products.sort(function(a,b) {
        if(a.productName > b.productName){
            return 1;
        }
        return -1;
    });
    res.render("cart/shoppingcart", {title: 'Giỏ hàng', total: total, products: products, user:req.user});
};

exports.cart_update_product = async function(req, res) {
    var total = 0;
    var products = [];
    var totalPro = 0;
    if(!req.user) {

        if(!req.session.cart) {
            return res.redirect('/shoppingcart');
        }

        await Promise.all(req.session.cart.map( async element => {
            var temp = req.body[element.product];
            element.amount = parseInt(temp);
            if(element.amount !== 0) {
                var result  = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, img:1 })
                total+= element.amount*result.price;
                totalPro+= element.amount;
                products.push({productID: element.product, productName: result.name, productPrice: result.price, amount: element.amount, img: result['img'], total: element.amount*result['price']});
            }
            else{
                req.session.cart = req.session.cart.filter( pro => {return pro.amount !== 0;});
            }
        }));
    }
    else {
        if( req.user.cart==[]) {
            return res.redirect('/shoppingcart');
        }
        
        await req.user.cart.forEach( async element => {
            var temp = req.body[element.product];
            
            element.amount = parseInt(temp);
            if(element.amount !== 0) {
                var result = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, img:1 })
                total+= element.amount*result.price;
                totalPro+= element.amount;
                products.push({productID: element.product, productName: result.name, productPrice: result.price, amount: element.amount, img: result['img'], total: element.amount*result['price']});
            }
        });
        var user = await User.findById(req.user._id)
        user.cart = req.user.cart.filter( pro => {return pro.amount !== 0;});
        await user.save();
    }
    req.session.amountproduct = totalPro;
    products.sort(function(a,b) {
        if(a.productName > b.productName){
            return 1;
        }
        return -1;
    });
    res.redirect('/shoppingcart');
};

exports.order_list = async function(req, res) {
    var result = await Order.find({custom:req.user._id}).sort({day:-1})
    await Promise.all(result.map( async order=>{
        order.date = formatDate(order.day);
        order.total = order.shipfee;
        await Promise.all(order.products.map( async element => {
            var result = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, })
            order.total += element.amount*result.price;
            element.product = result.name;
            element.price =result.price;
        }))
    }));
    res.render('cart/history', { title: 'Lịch sử mua hàng', data:result, admin:req.user}); 
};

exports.order_detail = async function(req, res, next){
    var total=0;
    var order = await Order.findOne({_id:req.params.id});
    order.date = formatDate(order.day);
    var show = undefined
    if(order.status != 'Đã hủy'){
        show = true;
    }
    await Promise.all(order.products.map( async element => {
        var result = await Product.findOne({_id:element.product},{ _id:0, name:1, price:1, img:1 })
        total+= element.amount*result.price;
        element.product = result.name;
        element.price =result.price;
        element.img = result.img[0];
        element.total = element.amount*result.price;
    }));   
    order.totalship = total + order.shipfee;
    res.render('cart/orderdetail', { title: 'Chi tiết đơn hàng', data:order, total:total, admin:req.user,id:req.params.id,show:show}); 
}

exports.order_create = async function(req, res, next) {
    if(!req.user){
        res.redirect('/login');
    }
    const filter = /^[0-9-+]+$/;
    if (!filter.test(req.body.phone)) {
        req.session.sessionFlash = {
            type: 'error',
            message: 'Số điện thoại không hợp lệ.',
        };
        return res.redirect('/shoppingcart');
    }
    var order = new Order({
        custom: req.user._id,
        day: new Date(),
        status: "Đang giao",
        address: req.body.address + ", " + req.body.district + ", TP.HCM",
        products: req.user.cart,
        phone: req.body.phone,
        recipientname: req.body.recipientname,
        shipfee: formatCost(req.body.shipfee)
    });
    await order.save()
    var user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    req.session.cart = [];
    req.session.amountproduct = 0;
    res.redirect('/history');
}
exports.delete_order = async function(req, res, next) {
    var order = await Order.findById(req.params.id);
    order.status = 'Đã hủy'
    await order.save()
    res.redirect('/history');
}

