const express = require('express')
const CommandCenter = require('./controller/CommandCenter')
const user = require('./router/userRoutes')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(__dirname + '/public'))

app.get('/', CommandCenter.home)
app.get('/login', CommandCenter.loginForm)
app.post('/login', CommandCenter.login)
app.get('/menu', (req, res, next) => {
  if (req.session.loginStatus) {
    next()
  } else {
    req.session.err = 'You need to be logged in to use this feature'
    res.redirect('/login')
  }
}, CommandCenter.menu)
app.get('/register', CommandCenter.registerForm)
app.post('/register', CommandCenter.register)
app.get('/logout', CommandCenter.logout)
app.get('/add', CommandCenter.addCharaForm)
app.post('/add', CommandCenter.addChara)
app.get('/edit/:id', CommandCenter.editCharaForm)
app.post('/edit/:id', CommandCenter.editChara)
app.get('/delete/:id', CommandCenter.delete)
app.get('/:name', CommandCenter.promisedRollPage)

app.use('/user', express.static(__dirname + '/public'))
app.use('/user', user)


app.listen(port, () => console.log(`Listening on port ${port}`))