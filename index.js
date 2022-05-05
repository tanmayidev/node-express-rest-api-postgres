const express = require('express')
const app = express()
const PORT = 3000
const Pool = require('pg').Pool

// DATABASE CONNECTION
const pool = new Pool({
    user: 'tanmayi',
    host: 'localhost',
    database: 'restapi',
    password: 'tanmayi',
    port: 5432,
})

/*
//CORS error
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
*/

app.use(express.json()) //middleware

//rest api end points
app.get('/', (request, response) => {
    response.json({ info: 'Getting Info' })
  })




//QUERIES

//GET all users
app.get('/users', (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
    })
})

// GET USER BY ID
app.get('/users/:id', (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      if(results.rows.length > 0) {
        response.status(200).json(results.rows)
      }
      else {response.send("Error: 300")}
    })
})

// POST 
app.post('/users', (request, response) => {
    const { id, name, email } = request.body
    //console.log(name, email)
  
    pool.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [id, name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${id}`)
    })
  })

//PUT updated data in an existing user
// PUT is called idempotent - exact same call can be made many times and produces same result
// POST - exact same call repeated will continuosly make new users with the same data
app.put('/users/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3',[name, email, id],(error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
  })
})

// DELETE
app.delete('/users/:id', (request, response) => {
    const id = parseInt(request.params.id)
    
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})  
