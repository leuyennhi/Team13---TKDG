var Product = require('../models/products');
var Order = require('../models/orders');
var async = require('async');


function getValueMonth(data) {
    var value = [0,0,0,0,0,0,0,0,0,0,0,0];
    data.forEach((item) => {
      value[item._id-1]=item.total/1000000;
    });
    return value;
  }

exports.index = async function(req, res){
    const current = new Date();
    
    const day = current.getDate();
    const month = current.getMonth() +1;
    const year = parseInt(current.getFullYear());
    
    const newOrder = await Order.countDocuments({day: {$gt: new Date(year+'-'+ month +'-'+ day)}, status:"Đang giao"});
    const newBill = await Order.countDocuments({day: {$gt: new Date(year+'-'+ month +'-'+ day)}, status:"Đã nhận"});

    var list = await Order.aggregate(
        [
        {
            $match: {
                status: 'Đã nhận',
                day: {$gte: new Date(year+'-01-01'), $lte: new Date(year+'-12-31')}
            }
        },
        {
            $group: {
            _id: {$month: '$day'},
            product_list: { $push: "$products.product" },
            amount_list: {$push: "$products.amount"}
            }
        }
        ]
    ).sort({_id:1})
    if(list==0) {
        return res.render('index', { title: 'Trang chủ', admin:req.user,  newOrder: newOrder, newBill:newBill});
    }
        
        await Promise.all(list.map( async element => {
            await Promise.all(element.product_list.map(async (item, index1) => {
                element.total = 0;
                await Promise.all(item.map(async (pro, index2) => {
                    var result = await Product.findOne({_id:pro},{ _id:0, price:1})
                    element.total += element.amount_list[index1][index2]*result.price;
                }));
            }));
        }));
        return res.render('index', { title: 'Trang chủ', admin:req.user,  newOrder: newOrder, newBill:newBill, dataD: getValueMonth(list)});
    }