const app = require('./app')

init = _ => {
  const listenPort = process.env.PORT || 3000
  app.listen(listenPort)
  console.log('App listen on port', listenPort)
}

init()
