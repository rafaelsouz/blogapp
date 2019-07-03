if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://rafael:teste123@blogapp-prod-u4uat.mongodb.net/test?retryWrites=true&w=majority'}
}else{
    module.exports= {mongoURI: 'mongodb://localhost:27017/blogapp'}
}