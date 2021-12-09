const express = require('express')
const mongoose = require('mongoose')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
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

//nodemailer config

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: 'relixmatrix@gmail.com',
        pass: 'qwerty216@'
    }
});
    

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
    let data = ''
    req.body.order.forEach(ele =>{
        data = data + (
            `
            <tr style="border: 1px solid black;">
                <td>${ele.pname}</td>
                <td style="text-align:center;">${ele.quantity}</td>
                <td>${ele.price}</td>
            </tr>
            
            `
        )
    })

    let ins = new orderModel({name:req.body.name,email:req.body.email,address:req.body.address,price:req.body.price,order:JSON.stringify(req.body.order)})
    ins.save(err =>{
        if(err) { res.json({"msg":"Order Failed"})}
        else{ 

            const options = {
                from:'relixmatrix@gmail.com',
                to:req.body.email,
                subject:"Pizza Delivery Order Bill",
                html:`
                    <h2>Email: ${req.body.email}</h2>
                    <h2>Address: ${req.body.address}</h2>
                    <h2> Total Price: ${req.body.price}</h2>
                    <table style="border: 1px solid black;">
                        <thead>
                            <tr style="border: 1px solid black;">
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data}
                        </tbody>
                    </table>

                `
            }
            transporter.sendMail(options,function(err,info){
                if(err) console.log(err)
                else{
                    console.log(`Message sent to ${info.response}`)
                }
                
            })
            
            res.json({"msg":"Order Placed!!!"})}
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

Router.get('/testemail',(req,res)=>{
    const options = {
        from:'relixmatrix@gmail.com',
        to:'holecara@tempmailin.com',
        subject:"Hello",
        text:"Heelo world",
        html:"<b>My name is holle</b>"
    }
    transporter.sendMail(options,function(err,info){
        if(err) console.log(err)
        else{
            res.send(`Message sent to ${info.response}`)
        }
        
    })
    
})


module.exports = Router