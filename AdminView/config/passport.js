var LocalStrategy   = require('passport-local').Strategy;
var Admin            = require('../models/admins');
var bcrypt = require('bcrypt')


module.exports = function(passport) {
   passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });

    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
            done(null, admin);
        });
    });

   passport.use('local-signin', new LocalStrategy(
       {
            usernameField : 'email',
            passwordField : 'pass',
            passReqToCallback : true
        },
        function(req, email, password, done) {
                process.nextTick(function() {
                Admin.findOne({ 'email' :  req.body.email }, async function(err, admin) {
                if (err)
                    return done(err);
                if (!admin)
                    return done(null, false, req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Email không tồn tại.'
                      });
                if (!await bcrypt.compare(req.body.pass, admin.pass))
                    return done(null, false, req.session.sessionFlash = {
                        type: 'loginMessage',
                        message: 'Mật khẩu không đúng.'
                      });
                return done(null, admin);
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
                Admin.findOne({ 'email' : req.body.email }, async function(err, admin) {
                    if (err)
                        return done(err);
                    if (admin) {
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
                        const filter = /^[0-9-+]+$/;
                            if (!filter.test(req.body.phone)) {
                                return done(null, false, req.session.sessionFlash = {
                                    type: 'error',
                                    message2: 'Số điện thoại không hợp lệ.',
                                });
                            }
                        var newAdmin = new Admin({
                            name: req.body.name,
                            title: req.body.title,
                            email: req.body.email,
                            phone: req.body.phone,
                            gender: req.body.gender,
                            address: req.body.address,
                            birthday: req.body.birthday,
                            pass: await bcrypt.hash(req.body.pass, 10),
                            });
                        newAdmin.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newAdmin);
                        });
                    }
                });
            });
        }
    ));
}
