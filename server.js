const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoClient = require('mongodb').MongoClient

const app = express()

app.set('view engine', 'ejs')

const mongoUrl = 'mongodb://127.0.0.1:27017'

var mongoConnection

app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
    if(!mongoConnection) {
        mongoConnection = mongoClient.connect(mongoUrl, {useNewUrlParser: true})
    }

    mongoConnection
    .then(client => {
        req.db = client.db('tehran')
        next()
    })
    .catch(err => {
        mongoConnection = undefined
        console.log(err)
        next(err)
    })
})

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, "index.html"))
    req.db
    .collection('stories')
    .find()
    .toArray()
    .then(results => {
        res.render('index.ejs', {stories: results})
    })
    .catch(err => {
        throw err
    })
})

app.post('/story', (req, res) => {
    req.db
    .collection('stories')
    .insertOne(req.body)
    .then(() => {
        console.log('story saved')
    })
    .catch(err => {
        throw err
    })

    res.redirect('/')
})

app.listen(3000, () => console.log('server listening on 3000'))
