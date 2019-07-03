//Carregando Modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)
    const db = require('./config/db')

//Configurações

    //Sessão
        app.use(session({
            secret:'teste123',
            resave:true,
            saveUninitialized:true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        
        app.use(flash())
    
    //Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg'),
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    //BodyParser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine','handlebars')
    //Mongoose
            mongoose.Promise = global.Promise;
            mongoose.connect(db.mongoURI,{useNewUrlParser:true}).then(()=>{
                    console.log("Mongodb conectado");
                }).catch((err)=>{
                    console.log("Houve um erro ao se conectar ao mongodb " + err)
                })
    
    //Public
        app.use(express.static(path.join(__dirname,'public')))

        app.use((req,res,next)=>{   
            //console.log('Gank do middleware');
            next()
        })

//Rotas
    app.get('/', (req, res)=>{
        Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao carregas as postagens')
            res.render('/404')
        })
    })

    app.get('/postagem/:slug', (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg','Essa postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um error interno')
            res.redirect('/')
        })
    })

    app.get('/categorias', (req,res)=>{
        Categoria.find().then((categorias)=>{
            res.render('categorias/index', {categorias: categorias})
        }).catch((err)=>{
            req.flash('error_msg','Houve um error interno ao listar as categorias')
        })
    })

    app.get('/categorias/:slug', (req,res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens)=>{
                    res.render('categorias/postagens', {postagens: postagens,  categoria:categoria})
                }).catch((err)=>{
                    req.flash('error_msg','Houve um erro ao listar os posts')
                    res.redirect('/')
                })

            }else{
                req.flash('error_msg','Está categoria não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um error interno ao carregar a página dessa categoria')
            res.redirect('/')
        })
    })

    app.use('/usuarios', usuarios)
    app.use('/admin', admin)


    app.get('/404',(req,res) => {
        res.send('Error 404')
    })

//Outros
    const PORT =  process.env.PORT || 8081
    app.listen(PORT, ()=>{
        console.log('Servidor Rodando na porta '+ PORT);
    })