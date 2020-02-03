const jwt = require('jsonwebtoken')

function verifyToken(req, res, next)
{
  const {token} = req.body
  if( ! token )
  {
    return res.status(401).json({
      auth: false,
      message: 'No token provided'
    })
  }

  try
  {
    var decoded = jwt.verify(token,process.env.SECRET)
  }
  catch( err )
  {
    return res.json({
      auth: false,
      message: err.message,
      expiredAt: err.expiredAt
    })
  }
  req.userId = decoded.id 
  next()
}

module.exports = verifyToken