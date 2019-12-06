var User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');



exports.user_detail = function(req, res) {
    var month = [
        "01", "02", "03",
        "04", "05", "06", "07",
        "08", "09", "10",
        "11", "12"
      ];
    var user = req.user;
    var datebirth = user.birthday.getDate();
    if(user.birthday.getDate()<10){
        datebirth = '0' + datebirth;
    }
    var birth = user.birthday.getFullYear()+'-'+ month[user.birthday.getMonth()] + '-' + datebirth;
    res.render('users/account', { title: 'Tài khoản',user : user,birth:birth});
};


exports.user_create_get = function(req, res) {
    res.render('users/signin', { title: 'Đăng ký'});
};
exports.user_logout_get = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.user_update_get = function(req, res) {
    var month = [
        "01", "02", "03",
        "04", "05", "06", "07",
        "08", "09", "10",
        "11", "12"
      ];
      var user = req.user;
      var datebirth = user.birthday.getDate();
      if(user.birthday.getDate()<10){
          datebirth = '0' + datebirth;
      }
      var birth = user.birthday.getFullYear()+'-'+ month[user.birthday.getMonth()] + '-' + datebirth;
    res.render('users/edit', { title: 'Chỉnh sửa thông tin',user:user,birth:birth});
};


exports.user_update_post = async function(req, res) {
    req.body.avar = req.file.url;
    await User.findByIdAndUpdate(req.user._id,req.body);
    res.redirect('/myaccount');
};

exports.user_login_get = function(req, res) {
    req.session.sessionFlash = undefined;
    res.render('users/login', { title: 'Đăng Nhập' ,layout: 'users/login'});
};

exports.user_forgetpass_get = function(req, res) {
    req.session.sessionFlash = undefined;
    res.render('users/forgotpassword', { title: 'Quên mật khẩu' ,layout: 'users/forgotpassword'});
};
exports.user_forgetpass_post = function(req, res) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
                req.session.sessionFlash = {
                    type: 'error',
                    message: 'Email không tồn tại.'
                }
              return res.redirect('/forgotpassword');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASS,
            }
          });
      
          console.log('created');
          req.session.sessionFlash = { type: 'success',message: '1 Email đã được gửi đến ' + user.email + 'để reset mật khẩu'};
          transporter.sendMail({
            from: 'team384440470@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: 'Bạn nhận được mail này vì có người nào đó yêu cầu đổi mật khẩu\n\n' +
                  'Click vào đường link để đổi mật khẩu\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'Nếu không phải bạn, không cần nhấn vào đường link và mật khẩu của bạn vẫn giữ nguyên\n'
          });
          return res.redirect('/forgotpassword');
        }
      ], function(err) {
        if (err) console.log(err);
        res.redirect('/forgotpassword');
      });
};
exports.user_change_pass = function(req, res) {
    res.render('users/changepass',{title:'Thay Đổi Mật Khẩu'})
};
exports.user_change_pass_post = async function(req, res) {
    if(!await bcrypt.compare(req.body.pass,req.user.pass))
      res.render('users/changepass',{title:'Thay Đổi Mật Khẩu',message:'Mật khẩu sai'});
    else{
      if(req.body.newpass != req.body.repass)
        res.render('users/changepass',{title:'Thay Đổi Mật Khẩu',message:' Mật khẩu nhập lại không khớp'});
      else{
          var password = await bcrypt.hash(req.body.newpass, 10);
          await User.findByIdAndUpdate(req.user._id,{$set: {pass: password}});
          res.redirect("/");
      }
    }
};



exports.user_reset_get = async function(req, res) {
  req.session.sessionFlash = undefined;
  var user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) {
    req.session.sessionFlash = {
      type: 'error',
      message: 'Password reset token is invalid or has expired.'
    }
    return res.redirect('/forgotpassword');
  }
  res.render('users/resetpass',{user:user});
};

exports.user_reset_post = async function(req, res) {
  var url = '/reset/'+ req.params.token;
  var user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) {
    req.session.sessionFlash = {
      type: 'error',
      message: 'Password reset token is invalid or has expired.'
    }
    return res.redirect(url);
  }
  if(req.body.newpass!=req.body.repass){
    req.session.sessionFlash = {
      type: 'error',
      message: 'Mật khẩu nhập lại sai'
    }
    return res.redirect(url);
  }
  else{
    user.pass = await bcrypt.hash(req.body.newpass, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.redirect('/login');
  }
};

exports.user_active_account = async function(req, res) {
  req.session.sessionFlash = undefined
  var user1 = req.params.id ? await User.findById(req.params.id) : req.user;
  async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      
      function(token, done) {
        User.findOne({ email: user1.email }, function(err, user) {

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS,
          }
        });
    
        console.log('created');
        req.session.sessionFlash = { type: 'success',message: '1 e-mail đã gửi đến ' + user.email + ' để kích hoạt mật khẩu'};
        transporter.sendMail({
          from: 'team384440470@gmail.com',
          to: user.email,
          subject: 'Active tài khoản',
          text: 'Email kích hoạt mật khẩu\n\n' +
                'Nhấn vào đường link để kích hoạt\n\n' +
                'http://' + req.headers.host + '/active/' + token + '\n\n'
        });
        return res.render('users/activeemail',{title:'Xác nhận email'});
      }
    ], function(err) {
      if (err) console.log(err);
      res.redirect('/');
    });
};

exports.user_active_account_done = async function(req, res) {
  req.session.sessionFlash = undefined;
  var user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) {
    req.session.sessionFlash = {
      type: 'error',
      message: 'Password reset token is invalid or has expired.'
    }
    return res.render('users/doneactiveemail',{title:'Xác nhận email',message:'Mã xác nhận không đúng hoặc hết hạn'});
  }
  else{
    user.isActive  = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined; // 1 hour
    await user.save();
    return res.render('users/doneactiveemail',{title:'Xác nhận email',message:'Xác thực thành công'});
  }
};