import React,{useState,useEffect, useRef} from 'react'
import jwt_decode from 'jwt-decode'
import {Navbar, Container, Nav, Card, Button, Table, Form} from 'react-bootstrap'
import {tokenAuthenticate, fetchuser, placeorder} from '../config/NodeServices'

function Checkout(props) {
    const [products,setProducts] = useState(JSON.parse(sessionStorage.getItem('cart')) || [])
    const [quantity,setQuantity] = useState(0)
    const [sum,setSum] = useState(0)
    const [user,setUser] = useState([])
    
    //useRef 
    const cardnoRef = useRef(null)
    const cvvnoRef = useRef(null)

    useEffect(()=>{
        tokenAuthenticate().then(res =>{
            if(res.data.err===1){
                logout()
            }
        })
        if(sessionStorage.getItem('_token')!==undefined){
            const token = sessionStorage.getItem('_token')
            const decode = jwt_decode(token)
            fetchuser({"email":decode.uid}).then(res =>{
                setUser(res.data)
            })
        }
        let num = 0
        let total = 0
        products.forEach(index=>{
            num+=index.quantity
            total = total + (index.quantity * index.price)
        })
        setQuantity(num)
        setSum(total)
    },[products])

    const order = () =>{
        if(cardnoRef.current.value.length===16?true:false && cvvnoRef.current.value===3?true:false){
            if(cardnoRef.current.value===user.card_number && cvvnoRef.current.value===user.cvv_no){
                placeorder({"email":user.email,"name":user.name,"address":user.address,"price":sum,"order":products}).then(res =>{
                    alert(res.data.msg)
                    sessionStorage.removeItem('cart')
                    window.location.replace('/dashboard')

                })
            }else{  alert("order failed")}
        }else{ alert("card details are wrong") }    

    }

    const logout = () =>{
        sessionStorage.clear();
        window.location.replace('/')
    }

    return (
        <div className="checkout-div">
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#"><img alt="logo-img" width="80" src="images/gui/logo.svg"/></Navbar.Brand>
                    <Nav className="justify-content-end me-5">
                        <Nav.Link href="/dashboard">Menu</Nav.Link>
                        <Nav.Link href="/order">Order</Nav.Link>
                        <Nav.Link className="cart-quantity" href="/cart">Cart<sup>{quantity}</sup></Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className="profile-table">
                <Table variant="dark" bordered hover size="">
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <td>Mobile</td>
                            <td>{user.mobile}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{user.address}</td>
                        </tr>
                        <tr>
                            <td>Total Amount</td>
                            <td>{sum}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>      
            <div className="card-cardholder">
                <Card>
                    <Card.Body>
                        <Card.Title>Card Holder : {user.name}</Card.Title>
                        <Form.Group className="mb-3 form-insert">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control type="text" name="cardno" ref={cardnoRef} ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 form-insert">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" name="cvvno" ref={cvvnoRef} ></Form.Control>
                        </Form.Group>
                        <button onClick={order}>Pay</button>
                    </Card.Body>
                </Card>
            </div>
            <div className="footer">
                <div className="footer-social">
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-twitter"></i>
                    <i className="fab fa-youtube"></i>
                    <i className="fab fa-facebook-square"></i>
                </div>
                <div className="footer-ls">
                    <p>All Rights Reserved. Copyright &copy; Felix Mathew</p>
                </div>
            </div>      
        </div>
    )
}

export default Checkout
