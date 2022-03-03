/* eslint-disable no-undef */
const mongoose = require('mongoose')


if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const url =
    'mongodb+srv://Mikkuk:<password>@cluster0.efsdl.mongodb.net/phonebook?retryWrites=true&w=majority'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length === 5) {
    person.save().then(() => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}