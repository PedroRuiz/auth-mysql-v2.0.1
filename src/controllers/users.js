'use strict'

const { Router } = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool = require('../database')
const CApiKey = require('../uuid-apikey')
const CheckUsersCreate = require('./middlewares/checkUserCreate')
const verifyToken = require('./middlewares/verifyToken')

router.post('/signup', CheckUsersCreate, async (req,res) => {
  
  const {apikey,username,email,password } = req.body

  try {

    const salt              = await bcrypt.genSalt(10)
    const cryptedPassword   = bcrypt.hashSync(password,salt)
    const newPair           = await CApiKey.getNewPair()
    const creationdate      = new Date().toISOString().split('T')[0]
    const enddate           = new Date( new Date().setFullYear(new Date().getFullYear() +1)).toISOString().split('T')[0]

    const conn = await pool.getConnection()
    await conn.query(
      `INSERT INTO ${process.env.USERS}(applicationkey,username,email,password,uuid,apikey,startdate,enddate,active) VALUES ((SELECT idapplications from ${process.env.APPLICATIONS} WHERE apikey = ?),?,?,?,?,?,?,?,?)`,
      [apikey,username,email,cryptedPassword,newPair.uuid,newPair.apiKey,creationdate,enddate,true]
    )    
    conn.release()

    res.status(202).json({
      apikey,
      uuid: newPair.uuid,
      username,
      email,        
      creationdate,
      enddate,
      active:  true
    })
    
  } catch (e) {
    res.status(500).json(e)
  }
  
  
})

router.post('/signin', async (req,res) => {
  const { apikey, uuid } = req.body

  try {
    const conn = await pool.getConnection()
    const data = await conn.query(
      //`select *.u, a.apikey from ${process.env.USERS} u, ${process.env.APPLICATIONS} a WHERE u.uudi =.`
      `select  u.*, a.apikey as applicationkey from ${process.env.USERS} u, ${process.env.APPLICATIONS} a where u.uuid = ? and u.applicationkey = a.idapplications and u.active = 1 and now() between u.startdate and u.enddate and now() between a.creationdate and a.enddate `,
      [uuid]
    )
    conn.release()
    const user = data[0]

    if ( ! (user === undefined) )
    {
      if(user.applicationkey === apikey)
      {      
        const token = await jwt.sign(
          {id: user.uuid},
          process.env.SECRET,
          {expiresIn: process.env.EXPIRESIN }
        )

        res.json({
          auth: true,
          token
        })
      }
      else
      {
        res.json({
          auth: false
        })
      }
    } else {
      res.status(404).json({
        error: 'User not found'
      })
    }
  } catch(e) {
    res.status(500).json(e)
  }
})

router.post('/signwithemail', async (req,res) => {
  const { email, password, apikey } = req.body
  try {
    const conn = await pool.getConnection()
    const data = await conn.query(
      //`select *.u, a.apikey from ${process.env.USERS} u, ${process.env.APPLICATIONS} a WHERE u.uudi =.`
      `select  u.*, a.apikey as applicationkey from ${process.env.USERS} u, ${process.env.APPLICATIONS} a where u.email = ? and u.applicationkey = (select idapplications from ${process.env.APPLICATIONS} where apikey=?) and u.active = 1 and now() between u.startdate and u.enddate and now() between a.creationdate and a.enddate `,
      [email, apikey]
    )
    conn.release()
    const user = data[0]

    if ( ! (user === undefined) )
    {
      if( bcrypt.compareSync(password,user.password) )
      {      
        const token = await jwt.sign(
          {id: user.uuid},
          process.env.SECRET,
          {expiresIn: process.env.EXPIRESIN }
        )

        res.json({
          auth: true,
          token,
          uuid: user.uuid
        })
      } 
      else
      {
        res.json({
          auth: false
        })
      }
    } else {
      res.status(404).json({
        error: 'User not found'
      })
    }
  } catch(e) {
    res.status(500).json(e)
  }
})

router.get('/islogged/:token', verifyToken, async (req,res) => {
  const { token } = req.params
  res.status(200).json({
    auth: true,
    token: token
  })
})

router.post('/userdata', async (req,res) => {
  const { token } = req.body
  const verifiedToken = jwt.verify(token,process.env.SECRET)
  
  try {
    const conn = await pool.getConnection()
    const data = await conn.query(
      `select  u.*, a.apikey as applicationkey from ${process.env.USERS} u, ${process.env.APPLICATIONS} a where u.uuid = ? and u.applicationkey = a.idapplications and u.active = 1 and now() between u.startdate and u.enddate and now() between a.creationdate and a.enddate `,
      [verifiedToken.id]
    )
    conn.release()
    const user = data[0]

    res.json({
      apikey:  user.apikey,
      uuid:  user.uuid,
      username:  user.username,
      email:  user.email,        
      creationdate:  user.startdate.toISOString().split('T')[0],
      enddate:  user.enddate.toISOString().split('T')[0],
      active:  user.active === 1 ? true : false
    })
  } catch(e) {
    res.status(500).json(e)
  }
})

router.put('/update', async (req,res) => {
  const { token, username, email, password, active } = req.body
  
  try
  {
    var verifiedToken = jwt.verify(token,process.env.SECRET)
  }
  catch( err )
  {
    return res.json({
      auth: false,
      message: err.message,
      expiredAt: err.expiredAt
    })
  }
  
  const salt = await bcrypt.genSalt(10)
  const cryptedPassword = bcrypt.hashSync(password,salt)
  
  try {

    const conn = await pool.getConnection()
    const data = await conn.query(
      `UPDATE ${process.env.USERS} SET username = ?, email = ?, password = ?, active = ? WHERE uuid = ?`,
      [username,email,cryptedPassword, ((active===true) ? 1 : 0), verifiedToken.id],
    )
    conn.release()

    if( data.affectedRows === 1)
    {
      res.status(202).json({
        done: true,
        username,
        email
      })
    } else {
      res.status(404).json({
        message: `${verifiedToken.id} not found`
      })
    }

  } catch(e) {
    res.status(500).json(e)
  }
})

module.exports = router