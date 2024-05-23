const express = require('express');
const app = express();
var nodemailer = require('nodemailer');
//bcrypt
const bcrypt = require('bcrypt');
app.use(express.json());

//dotenv conf
require('dotenv').config();

const mongoose = require('mongoose');


console.log(process.env.MONGODB_CONNECTION)

mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(() => console.log('Connected to MongoDB...'));


//user Schema - email, password, confirmCode

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    confirmCode: Number,
    confirmCodeExpire: Date
});

const User = mongoose.model('User', userSchema);



//order shema
const orderSchema = new mongoose.Schema({
    userId: String,
    products: [String],
    totalPrice: Number
});

const Order = mongoose.model('Order', orderSchema);

//nodemailer transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "chagatay.yildiz@code.edu.az", //email
        pass: process.env.EMAIL_PASS //password
    }
});





app.post("/api/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    //user check from mongodb

    User.findOne({ email: email, password: password }).then((user) => {
        if (user) {

            

            //send confirm code
            let confirmCode = Math.floor(Math.random() * 1000000);
            user.confirmCode = confirmCode;
            user.confirmCodeExpire = new Date();
            user.save();

            var mailOptions = {
                from: "",
                to: email,
                subject: 'Confirm Code',
                text: 'Your confirm code: ' + confirmCode
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(500).send(error)
                }
                return res.status(200).send('Confirm code sent to your email')
            });
        } else {
            res.status(404).send('User not found')
        }
    })

})

//confirm code check
app.post("/api/confirm", (req, res) => {
    let email = req.body.email;
    let confirmCode = req.body.confirmCode;

    User.findOne({ email, confirmCode }).then((user) => {
        if (user) {
            //confirm code check
            if (user.confirmCodeExpire.getTime() + 600000 > new Date().getTime()) {
                res.status(200).send('Confirmed')
            } else {
                res.status(404).send('Confirm code expired')
            }
        } else {
            res.status(404).send('User not found')
        }
    }
    )
})



app.post("/api/register", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;


    //check user
    User.findOne({ email }).then((user) => {
        if (user) {
            res.status(404).send('User already exists')
        } else {
            //create user
            let newUser = new User({
                email,
                password
            });
            newUser.save().then(() => {
                res.status(200).send('User created')
            })
        }
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})



let password = "123";

//hash with bcrypt
bcrypt.hash(password, 10, function (err, hash) {
    console.log(hash)
});


//hash with sha 512
const crypto = require('crypto');
const hash = crypto.createHash('sha512');

hash.update(password);
console.log(hash.digest('hex'));
