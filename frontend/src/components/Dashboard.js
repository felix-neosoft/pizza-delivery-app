import React,{useState,useEffect} from 'react'
import {Navbar, Container, Nav, Card} from 'react-bootstrap'
import { fetchProducts } from '../config/NodeServices'

function Dashboard() {
    const [products,setProducts] = useState([])
    const [quantity,setQuantity] = useState(0)

    useEffect(()=>{
        fetchProducts().then(res =>{
            if(res.data.err===1){
                logout()
            }
            setProducts(res.data)
        })
        let cart = JSON.parse(sessionStorage.getItem('cart')) || []
        let num = 0
        cart.forEach(index=>{
            num+=index.quantity
        })
        setQuantity(num)
    },[])

    const addToCart = (val) =>{
        let check = true
        setQuantity(quantity+1)
        let cart = JSON.parse(sessionStorage.getItem('cart')) || []
        cart.forEach(index => {
            if(index.pid===val.pid){
                index.quantity+= 1
                check = false
            }
        })
        if(check){
            cart.push({"pid":val.pid,"quantity":val.quantity,"pname":val.pname,"price":val.price,"image":val.image})
        }
        sessionStorage.setItem('cart',JSON.stringify(cart))
    }


    const logout = () =>{
        sessionStorage.clear();
        window.location.replace('/')
    }

    return (
        <div className="dashboard-div">
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#"><img width="80" src="images/gui/logo.svg"/></Navbar.Brand>
                    <Nav className="justify-content-end me-5">
                        <Nav.Link href="#">Menu</Nav.Link>
                        <Nav.Link className="cart-quantity" href="/cart">Cart<sup>{quantity}</sup></Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            {products.map(value=>(
                <Card key={value.pid} style={{ width: '18rem', display:'inline-block', margin: '10px 45px' }}>
                    <Card.Img variant="top" src={value.image} />
                    <Card.Body>
                        <Card.Title className="card-title">{value.pname}</Card.Title>
                        <Card.Text className="card-price">Price : Rs.{value.price}</Card.Text>
                        <button className="card-btn" onClick={()=>addToCart(value)} >Add To Cart</button>
                    </Card.Body>
                </Card>

            ))}

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

export default Dashboard
