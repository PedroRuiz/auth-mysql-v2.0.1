

module.exports = function (req, res, next) {
  const { firstname, lastname, email, password } = req.body
  const regexpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var doNext = true
  if(
    ( firstname.length === 0) || 
    ( firstname.length > 255 )
  )
  {
    doNext = false
    res.send('firstname is not well formed')
  } 
  if(
    ( lastname.length === 0) || 
    ( lastname.length > 255 )
  )
  {
    doNext = false
    res.send('lastname is not well formed')
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
