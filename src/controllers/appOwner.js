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



router.post('/create',CheckOwnersCreate, async (req,res) => {
  const { firstname, lastname, email, password } = req.body
  const salt = await bcrypt.genSalt(10)
  const cryptedPassword = bcrypt.hashSync(password,salt)
  
  const deletion_token = jwt.sign(
    {id: email},
    process.env.SECRET
  )

  const { uuid } = apikey.getNewPair()

  try {
    const conn = await pool.getConnection()
    owner = await conn.query(
      `INSERT INTO ${process.env.APPOWNERS}(firstname,lastname,email,password,deletion_token,uuid) VALUES(?,?,?,?,?,?)`,
      [firstname, lastname, email, cryptedPassword, deletion_token, uuid]
    )
    conn.release()

    res.status(200).json({
      firstname,
      lastname,
      email,
      deletion_token,
      uuid,
    })

  } catch(e) {
    res.status(500).json( e )
  }
})

router.get('/uuid/:uuid', async (req, res) => {
  const { uuid } = req.params

  try {
    const conn = await pool.getConnection()
    const owner = await conn.query(
      `SELECT * FROM ${process.env.APPOWNERS} WHERE uuid = ?`,
      [uuid]
    )
    if( owner.length === 1 )
    {
      const response = owner[0]
      conn.release()
      res.status(200).json({
        firstname: response.firstname,
        lastname : response.lastname,
        email: response.email,
        deletion_token: response.deletion_token,
        uuid: response.uuid
      })
    }
    else
    {
      res.status(404).json({
        status: 404,
        message: 'owner not found'
      })
    }

  } catch( e ) {
    res.status(500).json(e)
  }
})

router.get('/emailpassword/:email/:password', async (req, res) => {
  const { email,password } = req.params

  try {
    const conn = await pool.getConnection()
    const owner = await conn.query(
      `SELECT * FROM ${process.env.APPOWNERS} WHERE email = ?`,
      [email]
    )
    if( owner.length === 1 )
    {
      const response = owner[0]
      if( bcrypt.compareSync(password,response.password))
      {
        conn.release()
        res.status(200).json({
          firstname: response.firstname,
          lastname : response.lastname,
          email: response.email,
          deletion_token: response.deletion_token,
          uuid: response.uuid
        })
      }
      else
      {
        res.status(404).json({
          status: 404,
          message: 'owner not found'
        })
      } 
    }
    else
    {
      res.status(404).json({
        status: 404,
        message: 'owner not found'
      })
    }

  } catch( e ) {
    res.status(500).json(e)
  }
})

router.delete('/delete', async (req,res) => {
  const { deletion_token,uuid } = req.body

  const conn = await pool.getConnection()
  const result = await conn.query(
    `DELETE FROM ${process.env.APPOWNERS} WHERE deletion_token = ? and uuid= ?`,
    [deletion_token,uuid]
  )
  conn.release()
  res.json(result)

})

router.post('/update', CheckOwnersCreate, async (req, res) => {
  const {firstname,lastname,email,password,uuid } = req.body
  const salt = await bcrypt.genSalt(10)
  const cryptedPassword = bcrypt.hashSync(password,salt)
  
  const conn = await pool.getConnection()
  const result =await conn.query(
    `UPDATE ${process.env.APPOWNERS} SET firstname = ?, lastname = ?, email = ?, password = ? WHERE uuid = ?`,
    [firstname,lastname,email,cryptedPassword,uuid]
  )
  if(result.affectedRows === 1)
  {
    res.status(202).json({
      status: 202,
      affectedRows: result.affectedRows
    })
  } 
  else 
  {
    res.status(404).json({
      status: 404,
      affectedRows: result.affectedRows
    })
  } 
})

module.exports = router