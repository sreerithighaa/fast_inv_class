// CommonJs
const fastify = require('fastify')({
  logger: true
})
const pool=require('./db/pool.js')
const fastifyStatic = require('@fastify/static')


// Register fastify-static to serve static files
const path = require('path');

//registger view engine
fastify.register(require('@fastify/view'), {
  engine:{ejs:require('ejs')},
  root:path.join(__dirname,'views')
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// Serve index.html at root
fastify.get('/', (request, reply) => {
  reply.view('login.ejs',{currentUser:"daniel"}); // index.html must be in the 'public' directory
});

fastify.get('/users', async(request, reply) => {
const roles=await pool.query('SELECT * FROM roles')

 
  try{
 return reply.view('users.ejs', { currentUser: "daniel" , roles:roles.rows})
  }catch(err){
    console.error(err)
    return reply.status(500).send('Server Error')
  }
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
  fastify.log.info(`server listening on ${address}`)
})