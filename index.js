const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/contactDance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

// DEFINING MONGOOSE SCHEMA
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});
const Contact = mongoose.model('Contact', contactSchema);

// MIDDLEWARES
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SETTING VIEWS
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ROUTES
app.get('/', (req, res) => {
    res.status(200).render('home.pug');
});

app.get('/contact', (req, res) => {
    res.status(200).render('contact.pug');
});

app.post('/contact', (req, res) => {
    const { name, phone, email, suggestion, age } = req.body;
    const myData = new Contact({ name, phone, email, suggestion, age });

    myData.save()
        .then(() => {
            res.send("This item has been saved to the database");
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Item was not saved to the database");
        });
});

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
