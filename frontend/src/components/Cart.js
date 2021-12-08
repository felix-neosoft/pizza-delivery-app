import React,{useState,useEffect} from 'react'
import {Navbar, Container, Nav, Table, Card} from 'react-bootstrap'
import { tokenAuthenticate } from '../config/NodeServices'


function Cart() {
    const [products,setProducts] = useState(JSON.parse(sessionStorage.getItem('cart')) || [])
    const [quantity,setQuantity] = useState(0)
    const [sum,setSum] = useState(0)

    useEffect(()=>{
        tokenAuthenticate().then(res =>{
            if(res.data.err===1){
                logout()
            }
        })

        let num = 0
        let total = 0
        products.forEach(index=>{
            num+=index.quantity
            total = total + (index.quantity * index.price)
        })
        setQuantity(num)
        setSum(total)
    },[products])

    const deleteProduct = (id) =>{
        let cart = products
        cart.splice(id,1)
        setProducts(cart)
        sessionStorage.setItem('cart',JSON.stringify(cart))
        window.location.replace('/cart')

    }

    const logout = () =>{
        sessionStorage.clear();
        window.location.replace('/')
    }

    return (
        <div className="cart-div">
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#"><img alt="logo-img" width="80" src="images/gui/logo.svg"/></Navbar.Brand>
                    <Nav className="justify-content-end me-5">
                        <Nav.Link href="/dashboard">Menu</Nav.Link>
                        <Nav.Link className="cart-quantity" href="/cart">Cart<sup>{quantity}</sup></Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className="cart-table">
                <Table variant="dark" bordered hover >
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th style={{textAlign:"center"}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((index,id)=>(
                            <tr key={id}>
                                <td>{id+1}</td>
                                <td><img height="100" alt="img" src={index.image} /> </td>
                                <td>{index.pname}</td>
                                <td>{index.quantity}</td>
                                <td>Rs.{index.price}</td>
                                <td className="btn-cart-del"><button onClick={()=>deleteProduct(id)}>delete</button></td>
                            </tr>
                        ))}
                        
                    </tbody>
                </Table>
            </div>
            <Card className="cart-checkout">
                <Card.Body >
                    <Card.Title>Total Price : Rs.{sum}</Card.Title>
                    <button onClick={()=>{
                        if(sum!==0){window.location.replace('/checkout')}
                        else{ alert("Cart is empty")}
                    }} className="ml-5" >Checkout</button>
                </Card.Body>
            </Card>
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

export default Cart
