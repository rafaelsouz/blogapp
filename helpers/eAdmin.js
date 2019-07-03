module.exports = {
    eAdmin: function (req,res,next) {
        if (req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }else{
            if (req.isAuthenticated()){
                req.flash('error_msg', 'Você deve ser administrador para acessar esta página')
                res.redirect('/')
            }else{ 
                req.flash('error_msg', 'Você deve está logado para acessar essa página')
                res.redirect('/')
            }
        }
    }
}