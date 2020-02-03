Apikey = require('uuid-apikey')

module.exports = async function (req, res, next) {
  const { uuid } = req.body
  if( Apikey.isUUID(uuid) )
  {
      next() 
  }
  else {
    res.status(401).json({
      "type" : "Client error responses",
      "code" : "401",
      "message" : "Bad uuid",
    })
  }
}

