const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async(req,res)=>{
    //Checking if user exists in DB
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).send('User already exists')
    }else{
        //Else add new user
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            interests: req.body.interests
        });
        await user.save();
        res.send(user);
    }
});

module.exports = router;