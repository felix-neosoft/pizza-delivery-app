const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    price:{
        type:Number
    },
    order:{
        type:String
    }
})

module.exports = mongoose.model("orderData",orderSchema)