const express = require('express');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


//ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
}, () =>
    console.log('connected to DB!')
)

// SENDING A POST REQUEST WIHT A NAME
app.post('/greeting', async (req, res) => {
    const user = req.body.name
    mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true
    }, () =>
        console.log('connected to DB!')
    )

    // CHECKING IF THE USER IS IN DB
    const findOneByName = User.find({name: user}, (err, people) => {
        if (err) 
            {console.log(err)
        } else {
            if (people.length === 0) {
                res.send("Привіт, " + user)
                // IF THE USER IS NOT IN DB, THEY ARE SAVED THERE
                const doc = new User({
                    name: user
                });

                doc.save();
            }else {
                res.send("Вже бачилися, " + user)
            }
        }
    })
})

// GETTING JSON OF USERS IN DB
app.get('/all_users', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch (err) {
        res.json({message:err});
    }
})



app.listen(3000)