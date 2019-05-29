const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)

console.log('Connecting to ', url)

mongoose
    .connect(url, { useNewUrlParser: true })
    .then(res => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
