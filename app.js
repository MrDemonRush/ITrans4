const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes/routes')
const path = require('path')
require('dotenv').config()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))
app.use('/api/auth', routes)

const PORT = process.env.PORT || 8080
const URI = `mongodb+srv://admin:${encodeURIComponent('m-fkJ7WnY6@rUn4')}@cluster0.ebbhk.mongodb.net/myThirdDB?retryWrites=true&w=majority`;
async function start() {
    try {
        await mongoose.connect(URI,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true
        })

        console.log("Connection to db is established")
    } catch (e) {
        console.log("Server Error", e.message)
    }
}
start()

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, ()=>
{
    console.log('connected,, ',PORT)
})
