var User = require('../models/users');
var async = require('async');


exports.accounts_list = function(req, res) {
  var itemPerPage = 5;
  page = req.params.page?req.params.page:1;
  async.parallel({
      users: function(callback){
        User.find()
          .skip((itemPerPage * page) - itemPerPage)
          .limit(itemPerPage)
          .exec(callback);
      },
      pageCount: function(callback){
        User.countDocuments().exec(callback)
      }
  },function(err, results) {
      if (err) { return next(err); }
      var pageNum = Math.ceil(results. pageCount/itemPerPage);
      var page = [];
      for(var i = 1;i<=pageNum;i++){
          page.push(i);
      }
      var linkPage = '/accounts';  
      res.render('accounts/accounts', { title: 'Quản lý tài khoản người dùng',linkPage:linkPage,page:page,list_users: results.users, admin:req.user});
  });
};

  exports.accounts_delete = function(req, res) {
    User.findOne({'_id':req.params.id},function(err,result){
      if(err){return console.log(err);} 
      res.render('accounts/accounts_delete', { title: 'Xóa tài khoản người dùng', user:result, admin:req.user});
    });
  };

  exports.accounts_lock_get = async function(req,res){
    var user = await User.findById(req.params.id);
    res.render('accounts/accounts_lock', { title: 'Mở khóa tài khoản người dùng', user:user, admin:req.user});
  }
  exports.accounts_unlock_get = async function(req,res){
    var user = await User.findById(req.params.id);
    res.render('accounts/accounts_unlock', { title: 'Khóa tài khoản người dùng', user:user, admin:req.user});
  }

  exports.accounts_lock = async function(req,res){
    var user = await User.findById(req.params.id);
    user.lock = true;
    await user.save();
    res.redirect('/accounts');
  }
  exports.accounts_unlock = async function(req,res){
    var user = await User.findById(req.params.id);
    user.lock = false;
    await user.save();
    res.redirect('/accounts');
  }
  exports.accounts_delete_post = function(req, res) {
    User.deleteOne({'_id':req.params.id})
          .exec(function(err,result){
            if(err){return console.log(err);}
            res.redirect('/accounts');
          })
  };

  exports.accounts_detail = async function(req, res) {
    var month = [
      "01", "02", "03",
      "04", "05", "06", "07",
      "08", "09", "10",
      "11", "12"
    ];
    var result = await User.findById(req.params.id);
    var date = result.birthday.getDate();
    if(date<10){
      date = '0'+date;
    }
    var birth = date+'/'+ month[result.birthday.getMonth()] + '/' + result.birthday.getFullYear() ;
    res.render('accounts/accounts_detail', { title: 'Chi tiết tài khoản người dùng', user:result,birthday:birth, admin:req.user});
  };
  
  