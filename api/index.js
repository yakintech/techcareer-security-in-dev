const express = require('express');
const { products } = require('../data/products');
const app = express();
const helmet = require('helmet');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(helmet());

//express size limit
app.use(express.json({ limit: '1mb' }));


// const rateLimit = require("express-rate-limit");
// const { slowDown } = require("express-slow-down");

//  const speedLimiter = slowDown({
//         windowMs: 60 * 1000, // 1 minute
//         delayAfter: 3, // allow 1 requests per minute, then...
//         delayMs: 500 // begin adding 500ms of delay per request above 1:
//     });

// app.use(speedLimiter);

// const limitConfig = {
//     windowMs: 60 * 1000, // 1 minute
//     max: 5, // limit each IP to 5 requests per windowMs
//     message: "Too many requests from this IP, please try again after a minute"
// };

// const limiter = rateLimit(limitConfig);
// app.use(limiter);


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World');
})


app.get("/api/products", (req, res) => {
    res.json(products);
})

app.post("/api/contacts", (req, res) => {
    //write contacts.txt file with the data
    let message = req.body.message;
    //append file message with the data and create a new line
    fs.appendFileSync('contacts.txt', message + '\n');
    res.send('Saved!');
})


app.post("/profile/upload", (req, res) => {
    //upload file
    let file = req.files.file;

    //size control
    if (file.size > 1024 * 1024) {
        return res.status(400).send('File is too large');
    }

    //extension control => jpeg, png, jpg, gif
    let extension = file.name.split('.')[1];
    if (extension !== 'jpeg' && extension !== 'png' && extension !== 'jpg' && extension !== 'gif') {
        return res.status(400).send('File type is not supported');
    }

    var guid = uuidv4();

    console.log(file);
    file.mv('./uploads/' + guid +  file.name, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send
        }
        
        res.send('File uploaded!');
    })
})
    





    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })