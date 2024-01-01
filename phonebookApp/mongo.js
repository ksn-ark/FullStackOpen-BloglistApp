const mongoose = require('mongoose')

const argLength = process.argv.length

if (argLength < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Nark:${password}@cluster0.7zpdp1o.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (argLength === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.length > 0
      ? result.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      : console.log('No records')
    mongoose.connection.close()
    process.exit(1)
  })
} else if (argLength < 5) {
  console.log('missing fields')
  mongoose.connection.close()
  process.exit(1)
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log('person added')
    mongoose.connection.close()
  })
}
