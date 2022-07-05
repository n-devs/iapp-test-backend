const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

// get config vars
dotenv.config();

async function generateAccessToken (data) {
      return await new Promise((resolve, reject) => {
            if(typeof data === "undefined") {
                reject({
                    success: false,
                    statusCode: 401,
                    message: "error create token data",
                    error: "error create token data"
                });
            }else{
             
                let token = jwt.sign({...data}, process.env.TOKEN_SECRET, {
                  expiresIn: '7d'
                })
        
                resolve(token)
            }
           
        })
}

module.exports = generateAccessToken;