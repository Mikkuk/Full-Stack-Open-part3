const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

morgan.token('person', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.json())
app.use(cors())


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const personsLength = persons.length
    const date = new Date()
    res.send(`Phonebook has info for ${personsLength} people <br>
             ${date}` )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const randomId = Math.floor(Math.random() * (500000 - 1) + 1)

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

    let newPerson = {
        name:req.body.name,
        number:req.body.number,
        id:randomId
    }
    
    persons = persons.concat(newPerson)
    res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
