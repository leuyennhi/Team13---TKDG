module.exports = function(req, res, next){
    res.locals.links = [];
    res.locals.isShowBreadcrumbs = true;
    next();
}