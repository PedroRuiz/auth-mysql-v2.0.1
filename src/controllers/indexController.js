const { Router } = require('express')
const router = Router()
const path = require('path')

router.get('/', (req,res) => {
  try {
    res.sendFile(path.join(__dirname+'/../../README.html'))
  } catch(err) {
    res.status(500).send("*** E R R O R ***\n"+err)
  }
})

module.exports = router