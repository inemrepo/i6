var passport = sails.config.passport;


module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function(req, res) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) res.send(err);
                _onLoginSuccess(req,res,user, info);
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};


function _onLoginSuccess(req,res, user, info){    
    if(typeof(sails.config.auth)== 'undefined'){
        res.ok(sails.config);
        //res.serverError('Konfigurasi tidak ditemukan : <i>"./config/auth.js"</i>');
        return;
    }
    var postResponse = sails.config.auth.postActions.login.success;
    if(postResponse=='undefined'){
        res.send('Tidak ada aksi yang didefinisikan!');
    }else if(postResponse=='default'){   
        return res.ok({
            message: info.message,
            user: user
        });
    }else if(postResponse=='current'){
        res.redirect(req.session.currentPath);
        delete req.session.currentPath;
    }else if(typeof(postResponse)=='string' && _isURI(postResponse)){
        res.redirect(postResponse);
    }else{        
        res.forbidden(postResponse);
    }
}


/**
 * Tries to check if the given string is a URI
 *
 * @param  {String}  str the string to check
 * @return {Boolean}     true if string is a URI
 * @api private
 */
function _isURI(str) {
  if (str.indexOf('/') === 0) { /* assume relative path */
    return true;
  } else if (str.indexOf('http') >= 0) { /* assume url */
    return true;
  }

  return false;
}