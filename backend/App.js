const express = require('express')
const PORT = 8899
const app = express()

app.listen(PORT,err=>{
    if(err) throw err
    console.log(`Server Started at PORT:${PORT}`)
})