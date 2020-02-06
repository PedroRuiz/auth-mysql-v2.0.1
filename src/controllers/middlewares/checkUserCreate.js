'use strict'
const ApiKey = require('uuid-apikey')

module.exports = function(req,res,next) {
  const { apikey, username, email, password } = req.body
  const regexpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var doNext = true
  if( ! ApiKey.isAPIKey(apikey) )
  {
    doNext = false
    res.json('apikey not well formed')
  }
  if( (username.length === 0) || (username.length > 255) )
  {
    doNext = false
    res.json('username not well formed')
  }
  if(
    ! (regexpEmail.test(String(email).toLowerCase()))
  )
  {
    doNext = false
    res.send('email is not well formed')
  }
  if(
    ( password.length === 0) || 
    ( password.length > 255 )
  )
  {
    doNext = false
    res.send('password is not well formed')
  } 
  if(doNext) next()
}
