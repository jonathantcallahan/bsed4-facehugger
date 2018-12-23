const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express();
const PORT = process.env.PORT || process.argv[2] || 3000;
const URI = 'mongodb://jonathan:password1@ds243084.mlab.com:43084/facehugger'

const MONGODB_URI = URI;
const Person = require('./models/person')

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//const html = require('.controllers/html')
const api = require('./controllers/api')
//html(app)
api(app, Person)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

