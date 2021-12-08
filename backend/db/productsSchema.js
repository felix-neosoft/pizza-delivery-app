const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    pid:{
        type:Number,
        required:true
    },
    pname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    quantity:{
        type:Number
    }
})

module.exports = mongoose.model("product",productSchema)