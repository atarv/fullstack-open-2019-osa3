/* Full-stack open 2019 Osa 3 puhelinluettelo */
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '045-1236543'
    },
    {
        id: 2,
        name: 'Arto Järvinen',
        number: '041-21423123'
    },
    {
        id: 3,
        name: 'Lea Kutvonen',
        number: '040-04323234'
    },
    {
        id: 4,
        name: 'Martti Tienari',
        number: '09-784232'
    }
]

app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        return res.status(404).end()
    }
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    console.log(person)

    if (!person) {
        return res.status(404).end()
    }
    persons = persons.filter(p => p.id != id)
    console.log(persons)

    res.end()
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    if (persons.find(p => p.name === newPerson.name)) {
        return res.status(400).json({ error: 'Name must be unique' })
    } else if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({ error: 'Person must have both a name and a number' })
    }

    const newId = Math.ceil(Math.random() * 9000000)
    newPerson.id = newId
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.charset = 'UTF-8'
    res.send(`<p>Puhelinluettelossa on ${persons.length} nimeä</p><p>${date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
