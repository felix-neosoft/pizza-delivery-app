const express = require('express')
const mongoose = require('mongoose')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecretKey = ':MQbA~22)r9"wnu+hlWw'


//database imports
const userModel = require('../db/userSchema')
const productModel = require('../db/productsSchema')
const orderModel = require('../db/orderSchema')


//MongoDB Connection
const db="mongodb://localhost:27017/pizza_delivery"
const connectDB = async() =>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true})
        console.log("Database Connected")
    }
    catch(err){
        console.log(err.message)
    }
}
connectDB()

//JWT Authentication
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null){
        res.json({"err":1,"msg":"Token is empty"})
    }
    else{
        jwt.verify(token,jwtSecretKey,(err,data)=>{
            if(err) { res.json({"err":1,"msg":"Token does not match"}) }
            else{ next() }
        })
    }
}

//Routing
Router.post('/login',(req,res)=>{
    userModel.findOne({email:req.body.email,password:req.body.password},(err,data)=>{
        if(err) throw err
        if(data!==null){
            let payload = { uid:req.body.email}
            const token = jwt.sign(payload,jwtSecretKey,{expiresIn:360000})
            res.json({"err":0,"msg":"Login Successful","token":token})
        }else{
            res.json({"err":1,"msg":"Login Failed"})
        }
        
    })
})


Router.post('/register',(req,res)=>{
    let ins = new userModel({name:req.body.name,email:req.body.email,mobile:req.body.mobile,address:req.body.address,password:req.body.password,card_number:"",cvv_no:""})
    ins.save(err =>{
        if(err) {res.send("User already exists")}
        else{
            res.send("Registerd Successfully")
        }
    })
})

Router.get('/productsdata',authenticateToken,(req,res)=>{
    productModel.find({},(err,data)=>{
        if(err) throw err
        res.send(data)

    })
})

Router.get('/checktoken',authenticateToken,(req,res)=>{
    res.json({"err":0,"msg":"token match"})
})

Router.post('/fetchuser',(req,res)=>{
    userModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err
        res.send(data)
    })
})

Router.post('/addcard',(req,res)=>{
    userModel.updateOne({email:req.body.email},{$set:{card_number:req.body.cardno,cvv_no:req.body.cvvno}},err=>{
        if(err) { res.json({"msg":"Card Details Entry Failed"})}
        else { res.json({"msg":"Card Added"}) }
    })
})

Router.post('/orderplace',(req,res)=>{
    let ins = new orderModel({name:req.body.name,email:req.body.email,address:req.body.address,price:req.body.price,order:JSON.stringify(req.body.order)})
    ins.save(err =>{
        if(err) { res.json({"msg":"Order Failed"})}
        else{ res.json({"msg":"Order Placed!!!"})}
    })
})

Router.post('/deleteuser',(req,res)=>{
    userModel.deleteOne({email:req.body.email},usererr=>{
        if(usererr) { res.json({"msg":"Delete Operation Failed"})}
        orderModel.deleteMany({email:req.body.email},ordererr=>{
            if(ordererr) { res.json({"msg":"Delete Operation Failed"})}
            else{ res.json({"msg":`User Account Deleted: ${req.body.email}`})}
        })
    })
})

Router.post('/fetchorder',(req,res)=>{
    orderModel.find({email:req.body.email},(err,data)=>{
        if(err) throw err
        console.log(data)
        console.log(req.body.email)
        res.json({"data":data})
    })
})


module.exports = Router