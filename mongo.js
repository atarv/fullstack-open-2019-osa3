const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack-kayttaja:${password}@fullstack-xshtw.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({})
        .then(res => {
            console.log('Puhelinluettelo:')

            res.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
        .catch(() => {
            console.log('Haku epäonnistui')
            mongoose.connection.close()
        })
    return
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
    name: name,
    number: number
})

person.save().then(res => {
    console.log(`Lisättiin ${res.name} numero ${res.number} luetteloon`)
    mongoose.connection.close()
})
// const note = new Note ({
//     content: 'muistiinpano',
//     date: new Date(),
//     important: true
// })

// note.save().then(res => {
//     console.log('note saved', res)
//     mongoose.connection.close()
// })
