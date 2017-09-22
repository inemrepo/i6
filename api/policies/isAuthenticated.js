module.exports = function(req, res, next) {
   if (req.isAuthenticated()) {
        return next();
    }
    else{
		req.session.currentPath = req.path;
        return res.redirect('/login');
    }
};

