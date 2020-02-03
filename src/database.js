const mariadb = require('mariadb')
const pool = mariadb.createPool(
  {
    host:             process.env.DB_HOST,
    database:         process.env.DATABASE,
    user:             process.env.DB_USER,
    password:         process.env.DB_PASS,
    connectionLimit:  5
  }
)

pool.getConnection()
  .then(
    console.log('Database is connected')
  )
  .catch( err => {
    console.log('*** Database connection error ***')
    throw new Error(err)
  })

module.exports = pool
