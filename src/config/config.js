const dotenv = require("dotenv")

dotenv.config()

if(!process.env.MONGO_URI){
    throw console.error("mongodb connection url is not define");
    
}
else if(!process.env.JWT_SECRET_KEY){
    throw console.error("jwt secret key is not defined")

}
else if(!process.env.GOOGLE_CLIENT_ID){
    throw console.error("google client id is not defined")
}
else if(!process.env.GOOGLE_CLIENT_SECRET){
    throw console.error("google client secret is not defined")

}
else if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw console.error("google refresh token is not defined")
}
else if(!process.env.GOOGLE_USER){
    throw console.error("google user is not defined")
}
else if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw console.error("image kit private key is required")
}

const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER:process.env.GOOGLE_USER,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY
}


module.exports = config;