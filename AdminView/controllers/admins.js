var Admin= require('../models/admins');
const saltRounds = 10;
var b = require('bcrypt');
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
    return yyyy+"-"+mm+"-"+dd;
    
  }

  function formatDate_detail(date){
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

exports.login_load = function(req, res, next) {
    res.render('admins/signin', { title: 'Đăng nhập', layout:false});
};

exports.register_load = function(req, res, next) {
    res.render('admins/signup', { title: 'Đăng ký', layout:false});
};

exports.admins_list = function(req,res,next){
    Admin.find({},function(err,result){
        if(err){return console.log(err);} 
        res.render('admins/admins', { title: 'Danh sách quản trị viên',list_admins: result, admin:req.user});
      });
}

exports.admins_detail = async function(req,res,next){
   result = await Admin.findById(req.params.id);
      if(result.birthday){
        var birth = formatDate_detail(result.birthday);
      }
      res.render('admins/admins_detail', { title: 'Chi tiết quản trị viên', admin:result,birthday:birth});
}

exports.edit_info_admin = function(req, res) {
    if(req.user.birthday){
        var birth = formatDate(req.user.birthday);
    }
    res.render('admins/edit_info_admin', {title: 'Thay đổi thông tin admin', admin:req.user, birth:birth});
};

exports.edit_info_admin_post = function(req, res) {
    Admin.findByIdAndUpdate(req.user._id, req.body)
      .exec(function(err,result){
        if(err){return console.log(err);}
        res.redirect('/home');
      });
};

exports.signout = function(req,res){
  req.logout();
  res.redirect('/');
}

exports.changepass = function(req,res){ 
  res.render("admins/changepass",{title:"Đổi mật khẩu", admin:req.user});
}

exports.changepass_post = async function(req,res){
  
  Admin.findById(req.user._id, async function(err, result){
    if(err){return console.log(err);}
    var test = await b.compare(req.body.passpresent, req.user.pass);
    if(!test)
    {
      return res.render("admins/changepass", {title:"Đổi mật khẩu", message:"Mật khẩu không đúng.", admin:req.user});
    }
    if(req.body.pass != req.body.repass){
      return res.render("admins/changepass", {title:"Đổi mật khẩu", message:"Mật khẩu không khớp.", admin:req.user})
    } 
    else {
      var password = await b.hash(req.body.pass, 10);
      await Admin.findByIdAndUpdate(req.user._id, {$set: {pass: password}}).exec(function(err,result){
        if(err){return console.log(err);}
        res.redirect("/admins/edit_info");
      }); 
    }
  })
}