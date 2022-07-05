const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const AuthorizationBearer = require('./AuthorizationBearer');

// get config vars
dotenv.config();

const RecheckToken = async (req) => {

      return await new Promise((resolve, reject) => {

            try {
                  AuthorizationBearer(req).then(data => {
                        console.log(typeof data.token);
                        if (data.token !== "null") {
                              jwt.verify(data.token, process.env.TOKEN_SECRET, function (err, decoded) {
                                    if (err) {
                                          reject(err)
                                    } else {
                                          if (decoded._doc) {
                                                console.log(decoded);
                                                resolve({ user: decoded._doc })
                                          }
                                    }

                              })
                        }

                  }).catch(err => {
                        reject(err)
                  })

            }
            catch (err) {
                  reject(err)
            }
            // resolve(decoded)

      })
}

module.exports = RecheckToken