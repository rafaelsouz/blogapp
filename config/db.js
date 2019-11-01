if(process.env.NODE_ENV == 'production'){
    module.exports = {
        mongoURI: 'mongodb+srv://<username>:<password>@<db_mongo_url>'
    }
}else{
    module.exports= {
        mongoURI: 'mongodb://localhost:27017/blogapp'
    }
}