const { Router } = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool = require('../database')
const apikey = require('../uuid-apikey')
const middleWareVerifyToken = require('./middlewares/verifyToken')
const middleWareCheckApiKey = require('./middlewares/checkApiKeys')
const middleWareCheckUUID = require('./middlewares/checkUUID')
const CheckOwnersCreate = require('./middlewares/checkOwnersCreate')

router.post('/create', async (req,res) => {
  try {
    const { owneruuid, appname } = req.body
    const salt = await bcrypt.genSalt(10)
    
    const { uuid, apiKey } = apikey.getNewPair()
    const creationdate = new Date().toISOString().split('T')[0]
    const enddate = new Date( new Date().setFullYear(new Date().getFullYear() +1))

    const conn = await pool.getConnection()
    const newApp = await conn.query(
      `INSERT INTO ${process.env.APPLICATIONS}(idowners,appname,creationdate,enddate,uuid,apikey) VALUES((select idowners from ${process.env.APPOWNERS} where uuid = ?),?,?,?,?,?)`,
      [owneruuid,appname,creationdate,enddate,uuid,apiKey]
    )
    conn.release()

    res.status(200).json({
      created : (newApp.affectedRows === 1) ? true : false,      
      appname,
      creationdate,
      enddate,
      uuid,
      apiKey
    })
    
  } catch(e) {
    res.status(500).json(e)
  }
})

router.delete('/delete', async (req,res) => {
  
  try {
    const { apikey } = req.body

    const conn = await pool.getConnection()
    const result = await conn.query(
      `DELETE FROM ${process.env.APPLICATIONS} WHERE apikey = ?`,
      [apikey]
    )
    conn.release()
    res.status(202).json({
      affectedRows: result.affectedRows,
      message : (result.affectedRows === 1) ? 'All auth users of this application are deleted too' : 'nothing to delete'
    })
  } catch(e) {
    res.status(500).json(e)
  }

})

module.exports = router