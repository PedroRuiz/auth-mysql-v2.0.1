/**
 * REMANE THIS TO app.js
 */

const express = require('express')
const app = express()
const morgan = require('morgan')

app.use( express.json() )
app.use( morgan('dev') )
app.use( express.urlencoded({extended: false}) )

process.env.DB_HOST   = 'YOUR HOST'
process.env.DB_USER   = 'DB USER'
process.env.DB_PASS   = 'DB USER PASS'
process.env.SECRET    = 'SECRET PASS TO cryptjs'
process.env.DATABASE  = 'DATABASE NAME'
process.env.TOKENNAME = 'token'
process.env.APIKEYNAME  = 'x-api-key'

app.use('/appowner/',require('./controllers/appOwner'))

module.exports = app