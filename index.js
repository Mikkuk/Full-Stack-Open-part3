require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


let persons = [

]

morgan.token('person', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.json())
app.use(cors())


app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people)
    })
        .catch(error => {
            next(error)
        })
})

app.get('/info', (req, res) => {
    const personsLength = Person.length
    const date = new Date()
    res.send(`Phonebook has info for ${personsLength} people <br>
             ${date}` )
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {

    if (!req.body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!req.body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
        .catch(error => {
            next(error)
        })
})

app.put('api/persons/:id', (req, res, next) => {

    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
