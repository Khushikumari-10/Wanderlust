const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//passport: is authentication middleware for Node.js 
//passport-local: passport strategy for authenticating with a username and password.
//passort-local-mongoose: is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);
//You're free to define your User how you like. 
// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
//Additionally, Passport-Local Mongoose adds some methods to your Schema. 

module.exports = mongoose.model('User', userSchema);