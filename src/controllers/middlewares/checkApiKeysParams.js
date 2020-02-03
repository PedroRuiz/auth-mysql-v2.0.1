Apikey = require('uuid-apikey')

module.exports = async function (req, res, next) {
  const { appkey } = req.params
  if( Apikey.isAPIKey(appkey) )
  {
      next() 
  }
  else {
    res.status(401).json({
      "type" : "Client error responses",
      "code" : "401",
      "message" : "Bad apikey",
    })
  }
}

