var Product = require('../models/products');
var Category = require('../models/catergories');
var async = require('async');
var engCat = { Áo: 'shirt', 'Chân Váy': 'skirt', Đầm: 'dress', Quần: 'short' };
var formatPriceHelper = require('../helpers/format-price.helper');

exports.try_on_clothes = async function(req, res) {
    res.locals.isShowBreadcrumbs = true;
    res.locals.links.push({ name: "Trang chủ", route: "/" });
    res.locals.links.push({ name: "Thử đồ", route: "/try-on-clothes" });
    var products = await Product.find();
    var categories = await Category.find();
    for (product of products) {
        product.img = product.img[0];

    }

    categories = categories.map((category, index) => {
        var listProducts = products.filter(
            product => product.catergory == category.id
        );

        return {
            id: category.id,
            name: category.name,
            isActive: false,
            listProducts
        };
    });
    if (categories.length > 0) {
        categories[0].isActive = true;
    }


    res.render('try-on-clothes/index', {
        title: 'Thử đồ',
        categories
    });
};

exports.product_detail_data = async function(req, res) {
    const { id } = req.params;

    var products = await Product.find();
    var categories = await Category.find();

    var product = products.find(ele => ele.id == id);
    var catergory = categories.find(ele => ele.id == product.catergory);
    var dataProduct = JSON.parse(JSON.stringify(product));
    dataProduct.type = engCat[catergory.name];
    dataProduct.price = formatPriceHelper(dataProduct.price);
    res.json(dataProduct);
};

exports.formatP = (req, res) => {
    return res.json(formatPriceHelper(req.params.price));
}