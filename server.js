const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const connectMongo = require('connect-mongo')

const authRoutes = require('./routes/auth')

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tehran')
const db = mongoose.connection
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
})

const app = express()


app.set('view engine', 'ejs')
app.use(express.static(__dirname + 'public')); 

app.use(bodyParser.urlencoded({ extended: true }))

const MongoStore = connectMongo(session)

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

app.use('/auth', authRoutes)

// app.get('/', (req, res) => {
//     req.db
//         .collection('stories')
//         .find()
//         .toArray()
//         .then(results => {
//             res.render('index.ejs', { stories: results })
//         })
//         .catch(err => {
//             throw err
//         })
// })

// app.post('/story', (req, res) => {
//     req.db
//         .collection('stories')
//         .insertOne(req.body)
//         .then(() => {
//             console.log('story saved')
//         })
//         .catch(err => {
//             throw err
//         })

//     res.redirect('/')
// })

app.listen(3000, () => console.log('server listening on 3000'))
