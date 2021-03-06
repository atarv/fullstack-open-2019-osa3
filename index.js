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
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

// Error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CaseError' && error.kind === 'ObjectId') {
        return response.statu(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)

// Serve front-end
app.use(express.static('build'))

// API calls
const baseUrl = '/api/persons'

/* Get all persons */
app.get(baseUrl, (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(err => next(err))
})

/* Get person with id */
app.get(`${baseUrl}/:id`, (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) res.json(person.toJSON())
            else res.status(404).end()
        })
        .catch(err => next(err))
})

/* Update person's data */
app.put(`${baseUrl}/:id`, (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson.toJSON()))
        .catch(err => next(err))
})

/* Delete person with id */
app.delete(`${baseUrl}/:id`, (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndRemove(id)
        .then(() => res.status(204).end())
        .catch(err => next(err))
})

/* Create a new person */
app.post(baseUrl, (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Person must have both a name and a number' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson
        .save()
        .then(saved => {
            res.json(saved.toJSON())
        })
        .catch(err => next(err))
})

/* Info page */
app.get('/info', (req, res) => {
    const date = new Date()
    let persons = NaN
    Person.collection
        .countDocuments({})
        .then(res => (persons = res))
        .finally(() => res.send(`<p>Puhelinluettelossa on ${persons} nimeä</p><p>${date}</p>`))
})

const PORT = process.env.PORT || 3001 // If PORT is not specified, use right hand side
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
