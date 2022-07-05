

/* 
วิธีใช้: AuthorizationBearer(req).then(success => {
    console.log(success);
}).catch(error => {
    console.log(error);
})
*/

async function AuthorizationBearer(req) {

    console.log(req.headers['authorization']);
      return await new Promise((resolve, reject) => {
          
          let _token_str = req.headers['authorization']; // Express headers are auto converted to lowercase
  
          console.log(_token_str);
          
          if (typeof _token_str !== "undefined") {
  
  
              if (_token_str.startsWith('Bearer ')) {
                  // Remove Bearer from string
                  _token_str = _token_str.slice(7, _token_str.length);
  
                  console.log(_token_str);
                  resolve({
                      success: true,
                      statusCode: 200,
                      message: "headers Authorization Bearer ok!",
                      token: _token_str,
                  })
  
  
              } else {
  
                  reject({
                      success: false,
                      statusCode: 401,
                      message: "error headers Authorization ไม่ได้กำหนด Bearer",
                      headers: { 'authorization': typeof req.headers['authorization'] }
                  })
              }
          }else {
              reject({
                  success: false,
                  statusCode: 401,
                  message: "error headers ไม่ได้กำหนด Authorization",
                  headers: { 'authorization': typeof req.headers['authorization'] }
              })
          }
  
      })
  }
  
  
  
  module.exports = AuthorizationBearer