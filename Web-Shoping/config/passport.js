var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/users');
var bcrypt = require('bcrypt')


module.exports = function(passport) {
   passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

   passport.use('local-login', new LocalStrategy(
       {
            usernameField : 'email',
            passwordField : 'pass',
            passReqToCallback : true
        },
        function(req, email, password, done) {
                process.nextTick(function() {
                User.findOne({ 'email' :  req.body.email }, async function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                     return done(null, false, req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Email không tồn tại.'
                      });
                if (!await bcrypt.compare(req.body.pass, user.pass))
                    return done(null, false, req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Mật khẩu không đúng.'
                    });
                if (user.lock === true)
                    return done(null, false,req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Tài khoản bị khóa.'
                    });   
                if (user.isActive === false)
                    return done(null, false,req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Tài khoản chưa được xác thực.',
                        message2: 'Kích hoạt?',
                        message3: user._id
                    });
                if(req.session.cart) {
                    user.cart = req.session.cart;
                }
                if(user.cart == null){
                    user.cart = [];
                }
                user.save();
                req.session.amountproduct= user.cart.length;
                req.session.user = user;
                return done(null, user);
                });
            });
        }
   ));

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField : 'email',
            passwordField : 'pass',
            passReqToCallback : true 
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'email' : req.body.email }, async function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.session.sessionFlash = {
                            type: 'loginMessage',
                            message: 'Email đã tồn tại.'
                          });
                    } else {

                        if(req.body.pass!==req.body.repass)
                            return done(null, false, req.session.sessionFlash = {
                                type: 'signupMessage', 
                                message1: 'Mật khẩu không khớp.'
                            });
                        if(req.body.pass.length<6)
                            return done(null, false, req.session.sessionFlash = {
                                type: 'signupMessage', 
                                message1: 'Mật khẩu phải lớn hơn 6 kí tự.'
                            });
                        var newUser = new User({
                            username: req.body.username,
                            birthday: req.body.birthday,
                            sex: req.body.gender,
                            email: req.body.email,
                            address: req.body.address,
                            pass : await bcrypt.hash(req.body.pass, 10),
                            avar: req.file.url,
                            isActive: false
                        });
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
}
