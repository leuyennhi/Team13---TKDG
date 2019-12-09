var express = require('express');

// Require controller modules.
var productController = require('../controllers/product.controller');
var cartController = require('../controllers/cart.controller');
var userController = require('../controllers/user.controller');
var tryOnClothesController = require('../controllers/tryOnClothes.controller');

var breadcrumbs_middleware = require('../middlewares/breadcrumbs.middleware');

module.exports = function(router, passport, parser) {
  router.get('/*', function(req, res, next) {
    if (!req.session.cart && !req.user) {
      req.session.amountproduct = 0;
    }
    res.locals.user = req.session.user;
    res.locals.amountproduct = req.session.amountproduct;
    res.locals.cart = req.session.cart;
    next();
  });
  router.get('/', productController.index);
  router.get('/page/:page', productController.index);
  router.post('/search', productController.home_search_post);
  router.get('/search/:search/:page', productController.home_search_get);
  router.post('/filter/multi', productController.home_filtermulti);
  router.get('/filter/:type', productController.product_sort_home);

  router.get('/product', productController.product_list);
  router.get('/search-products', productController.search_products);
  router.post('/product/search', productController.product_search_post);
  router.get(
    '/product/search/:search/:page',
    productController.product_search_get
  );
  router.post(
    '/product/:categoryId/:productName',
    productController.product_list_by_category
  );
  router.get('/product/:page', productController.product_list);
  router.get('/product/detail/:id', productController.product_detail);
  router.get(
    '/product/product-detail/:id',
    tryOnClothesController.product_detail_data
  );
  router.post('/product/detail/:id', productController.product_add_to_cart);
  router.get('/product/detail/:id/:page', productController.product_detail);
  router.post('/product/review/:id', productController.product_review);
  router.post('/product/filter/multi', productController.product_filtermulti);
  router.get('/product/filter/:type', productController.product_sort);
  router.post('/deleteorder/:id', cartController.delete_order);
  router.get('/myaccount', isLoggedIn, userController.user_detail);
  router.get('/login', userController.user_login_get);
  router.get('/logout', userController.user_logout_get);
  router.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );
  router.get('/reset/:token', userController.user_reset_get);
  router.post('/reset/:token', userController.user_reset_post);

  router.get('/forgotpassword', userController.user_forgetpass_get);
  router.post('/forgotpassword', userController.user_forgetpass_post);
  router.get('/edit', userController.user_update_get);
  router.post('/edit', parser.single('image'), userController.user_update_post);
  router.get('/signin', userController.user_create_get);
  router.post(
    '/signin',
    parser.single('image'),
    passport.authenticate('local-signup', {
      successRedirect: '/active',
      failureRedirect: '/signin',
      failureFlash: true
    })
  );
  router.get('/active', userController.user_active_account);
  router.get('/active/user/:id', userController.user_active_account);
  router.get('/active/:token', userController.user_active_account_done);
  router.get('/changepass', userController.user_change_pass);
  router.post('/changepass', userController.user_change_pass_post);
  router.get('/shoppingcart', cartController.cart_list);
  router.post('/shoppingcart', cartController.cart_update_product);
  router.get('/history', isLoggedIn, cartController.order_list);
  router.post('/history', isLoggedIn, cartController.order_create);
  router.get('/history/detail/:id', isLoggedIn, cartController.order_detail);
  
  router.get('/format/:price',tryOnClothesController.formatP);

  router.get('/faq', function(req, res, next) {
    res.render('faq', { title: 'Câu hỏi thường gặp' });
  });

  router.get('/policy', function(req, res, next) {
    res.render('policy', { title: 'Chính sách đổi trả' });
  });

  router.get('/aboutus', function(req, res, next) {
    res.render('aboutus', { title: 'Về chúng tôi' });
  });

  router.get('/try-on-clothes', tryOnClothesController.try_on_clothes);
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
