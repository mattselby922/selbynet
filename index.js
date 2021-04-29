/*
Author: Matt Selby
Resources: 
https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
https://www.tutorialsteacher.com/nodejs/access-mongodb-in-nodejs

              "Selbynet was developed as part of a
  capstone project at SUNY Polytechnic University, in Spring of 2021,
              under the supervision of Scott Spetka.">
*/

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const http = require('http');
const path = require('path');
const app = express();

// bcypt
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Previously, was getting 404 error (socket.io does not exist). This fixed the problem; Socket.io server listens to HTTP server, 
// and automatically serves client file 
var server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

const router = express.Router();
const users = require('./routes/users');
const mongoose = require('mongoose');

server.listen(process.env.PORT || 3000)

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// EXPRESS, looks at body of request for easy access to user-submitted data
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

app.use(express.json());
app.use('/api/users', users);



//MongoDB
const MongoClient = require('mongodb').MongoClient;


// main(), Connecting to Atlas Cluster, printing list of databases
// Based on MongoDB Start Guide: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
async function main(){
  const uri = "mongodb+srv://matt:idtUw3UUukmqwa3@cluster0.bhocy.mongodb.net/selbynet?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  

  try{
      await client.connect();            // connect to atlas cluster
      await listDatabases(client);       // list databases  
      // await listCollections(client);  // list collections
      // const selbynet = client.db("selbynet");
    }catch(e){
      console.error(e);
    } finally{
      await client.close();
    }
}

main().catch(console.error);

//Function to list all databases on cluster
async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
// Opening model connection (mongoose)
mongoose.connect("mongodb+srv://matt:idtUw3UUukmqwa3@cluster0.bhocy.mongodb.net/selbynet?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});


// Define user schema w/mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  interests: String
});

// Compiling schema into a model
const user = mongoose.model('users', userSchema);


// Server-side SocketIO Implementation

// Connection Listener
io.on('connection', socket =>{
  
  // Emitter for welcomeMessage
  socket.emit('welcomeMessage', 'Try sending a message to other users!');
  
  // Listening for chat message
  socket.on('chatMessage', msg=>{
    io.emit('message', msg);
  });
  
  // Let everyone know that someone has connected 
  socket.broadcast.emit('message', 'Someone has connected.')
  // Let everyone know that someone has disconnected
  socket.on('disconnect', ()=>{
    io.emit('message', 'Someone has left.');
  });
});




// ROUTING POST AND GET REQUESTS
// serve static files (html, css, images, .js)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  //Serve page
  res.redirect('/index');
});

// User creation form posted 
app.post('/index.js', async(client,res)=>{
  
        // bcrypt hashing
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(client.body.password, salt);
        
          // create user model
          const newUser = new user({
            username: client.body.username,
            email: client.body.email,
            password: hashedPassword,
            interests: client.body.interests   
            })

          // Save new user in Mongo 'users' collection of Selbynet database
          newUser.save(function (err){
          if(err) return console.error(err);
          
            }); // user saved! :]
            
            console.log('Username for newly created user: ', newUser.username);
            console.log('Email for newly created user: ', newUser.email);
            console.log('Salt: ', salt);
            console.log('Hashed Password: ', hashedPassword);

});
  


// When user logs in
app.post('/login', async(client,res)=>{
  // identify user credentials
})

app.get('/profile', (req,res)=>{
  res.render('profile.ejs');
})

// Upon click "Create Account" Button, render signup.ejs
app.get('/signup', (req, res)=>{
  res.render('signup.ejs');
});

// Upon click "Join the chatroom" Button, render chatroom.ejs
app.get('/chatroom', (req, res)=>{
  res.render('chatroom.ejs');
});
