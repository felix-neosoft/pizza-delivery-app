const express = require('express')
const cors = require('cors')
const PORT = 8899
const app = express()

app.use(cors())

//convert string data to json data
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//load routes
const Router = require('./routes/userRoutes')
app.use('/api',Router)



// Start Server
app.listen(PORT,err=>{
    if(err) throw err
    console.log(`Server Started at PORT:${PORT}`)
})

