if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const port = 3000;

//EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//EXPRESS, looks at body of request for easy access to user-submitted data
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

const mongoose = require('mongoose');

// Database Name
const dbName = 'selbynet';

//MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/selbynet';

// Connecting to MongoDB
//mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.once('open', _ =>{
  console.log('Connected to Selbynet MongoDB:', url);
});

db.on('error', err =>{
  console.error('There was a problem connecting to the database:', err);
});


//serve static files (html, css, images, .js)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  //Serve page
  res.redirect('/index');
});


//render signup.ejs view when get/signup
app.post('/signup', (req, res) =>{
  res.render('signup.ejs');
});

app.listen(process.env.PORT || 3000)

//Connect to localhost port
/*app.listen(port,() =>{
  console.log(`Listening on port ${port}`);
});*/
  app.get('/profile', (req,res)=>{
    res.render('profile.ejs');
  })
  //Upon click "Create Account" Button...
  app.get('/signup', (req, res)=>{
    res.render('signup.ejs');
  });

  //User inputs data
  app.post('/success', (req,res)=>{
    res.redirect('/success.html');
    var username = req.fields.username;
    var password = req.fields.password;
    var interests = req.fields.interests;

    //Check if username exists
    database.collection('users').findOne({
      $or: [{
        'username': username
      }]
    }, function (error, user) {
      //if username does exist, hash password
      if(user == null) {
        bcrypt.hash(password, 10, function (error, hash){
          database.collection('users').insertOne({
            'username': username,
            'password': password,
            'interests': interests,
            'avatar': '',
            'location': ''
          }, function (error, data){
            result.json({
              'status': 'success',
              'message': 'You have successfully created an account for Selbynet.'
            });
          });
        });
      } else{
        result.json({
          'staus': 'error',
          'message': 'Username already exists.'
        });
      }
    });
  });
