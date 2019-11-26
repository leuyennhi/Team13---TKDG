var express = require('express');


// Require controller modules.
var product_controller = require('../controllers/productController');
var cart_controller = require('../controllers/cartController');
var user_controller = require('../controllers/userController');


module.exports = function(router, passport, parser) {
	router.get('/*', function(req, res, next) {
		if(!req.session.cart&&!req.user){
			req.session.amountproduct = 0;
	   	}
		res.locals.user = req.session.user;
		res.locals.amountproduct = req.session.amountproduct;
		res.locals.cart  = req.session.cart;
		next();
	});
	router.get('/', product_controller.index);
	router.get('/page/:page', product_controller.index);
	router.post('/search', product_controller.home_search_post);
	router.get('/search/:search/:page', product_controller.home_search_get);
	router.post('/filter/multi', product_controller.home_filtermulti);
	router.get('/filter/:type',product_controller.product_sort_home);
	
	router.get('/product', product_controller.product_list);
	router.post('/product/search', product_controller.product_search_post);
	router.get('/product/search/:search/:page', product_controller.product_search_get);
	router.get('/product/:page',product_controller.product_list);
	router.get('/product/detail/:id', product_controller.product_detail);
	router.post('/product/detail/:id', product_controller.product_add_to_cart);
	router.get('/product/detail/:id/:page',product_controller.product_detail);
	router.post('/product/review/:id', product_controller.product_review);
	router.post('/product/filter/multi', product_controller.product_filtermulti);
	router.get('/product/filter/:type',product_controller.product_sort);
	router.post('/deleteorder/:id',cart_controller.delete_order);
	router.get('/myaccount', isLoggedIn,user_controller.user_detail);
	router.get('/login', user_controller.user_login_get);
	router.get('/logout', user_controller.user_logout_get);
	router.post('/login',passport.authenticate('local-login', {
		successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true 
	}));
	router.get('/reset/:token', user_controller.user_reset_get);
	router.post('/reset/:token', user_controller.user_reset_post);

	router.get('/forgotpassword', user_controller.user_forgetpass_get);
	router.post('/forgotpassword', user_controller.user_forgetpass_post);
	router.get('/edit',user_controller.user_update_get);
	router.post('/edit',parser.single("image"),user_controller.user_update_post);
	router.get('/signin', user_controller.user_create_get);
	router.post('/signin',parser.single("image"), passport.authenticate('local-signup', {
        successRedirect : '/active',
        failureRedirect : '/signin',
        failureFlash : true 
	}));
	router.get('/active',user_controller.user_active_account);
	router.get('/active/user/:id',user_controller.user_active_account);
	router.get('/active/:token',user_controller.user_active_account_done);
	router.get('/changepass',user_controller.user_change_pass);
	router.post('/changepass',user_controller.user_change_pass_post);
	router.get('/shoppingcart', cart_controller.cart_list);
	router.post('/shoppingcart', cart_controller.cart_update_product);
	router.get('/history',isLoggedIn,cart_controller.order_list);
	router.post('/history',isLoggedIn,cart_controller.order_create);
	router.get('/history/detail/:id',isLoggedIn,cart_controller.order_detail);
	

	router.get('/faq', function(req, res, next){
		res.render('faq', {title: 'Câu hỏi thường gặp'});
	})

	router.get('/policy', function(req, res, next){
		res.render('policy', {title: 'Chính sách đổi trả'});
	})

	router.get('/aboutus', function(req, res, next){
		res.render('aboutus', {title: 'Về chúng tôi'});
	})
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
