const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personSchema = new Schema({
    name: String,
    start: String,
    stamp: String,
    order: String
})

const Person = mongoose.model('Person',personSchema)

module.exports = Person