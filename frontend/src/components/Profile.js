import React,{useState, useEffect, useRef} from 'react'
import {Navbar, Container, Nav, Form, Table, Card} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import { addcard, deleteuser, fetchuser, tokenAuthenticate } from '../config/NodeServices'

//RegEx for Validation
const RegForCardNo = RegExp('^[0-9]{16,16}$')
const RegForCvvNo = RegExp('^[0-9]{3,3}$')
 
function Profile() {
    //State Variables
    const [products,setProducts] = useState(JSON.parse(sessionStorage.getItem('cart')) || [])
    const [quantity,setQuantity] = useState(0)
    const [user,setUser] = useState([])

    //useRef Assigning
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const mobileRef = useRef(null)
    const passwordRef = useRef(null)
    const cpasswordRef = useRef(null)
    const addressRef = useRef(null)
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
    },[])

    const deleteUser = () =>{
        deleteuser({"email":user.email}).then(res =>{
            alert(res.data.msg)
            logout()
        })
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{    
        if(cardnoRef.current.value.length===16?true:false && cvvnoRef.current.value.length===3?true:false){
            addcard({"email":user.email,"cardno":cardnoRef.current.value,"cvvno":cvvnoRef.current.value}).then(res =>{
                alert(res.data.msg)
            })
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
                    <Navbar.Brand href="#"><img width="80" src="images/gui/logo.svg"/></Navbar.Brand>
                    <Nav className="justify-content-end me-5">
                        <Nav.Link href="/dashboard">Menu</Nav.Link>
                        <Nav.Link className="cart-quantity" href="/cart">Cart<sup>{quantity}</sup></Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className="profile-table">
                <Table variant="dark" bordered hover >
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
                            <td>Delete User</td>
                            <td><button onClick={deleteUser} className="btn-delete">delete</button></td>
                        </tr>
                    </tbody>
                </Table>
            </div>  

            <div className="card-cardholder">
                <Card>
                    <Card.Body>
                        <Card.Title>Add Card Details</Card.Title>
                        <Form.Group className="mb-3 form-insert">
                            <Form.Label>Card Holder</Form.Label>
                            <Form.Control type="text" name="name" value={user.name} readOnly></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 form-insert">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control type="text" name="cardno" ref={cardnoRef} ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 form-insert">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" name="cvvno" ref={cvvnoRef} ></Form.Control>
                        </Form.Group>
                        <button onClick={formSubmit}>Add</button>
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

export default Profile
