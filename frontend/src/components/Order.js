import React,{useState,useEffect} from 'react'
import {Navbar, Container, Nav, Table, Card} from 'react-bootstrap'
import { orderfetch, tokenAuthenticate } from '../config/NodeServices'
import jwt_decode from 'jwt-decode'


function Order() {
    const [products,setProducts] = useState([])
    const [sum,setSum] = useState([])

    useEffect(()=>{
        tokenAuthenticate().then(res =>{
            if(res.data.err===1){
                logout()
            }
        })

        if(sessionStorage.getItem('_token')!==undefined){
            const token = sessionStorage.getItem('_token')
            const decode = jwt_decode(token)
            orderfetch({"email":decode.uid}).then(res =>{
                const arr = []
                const ps = []
                res.data.data.forEach(ele =>{
                    arr.push(JSON.parse(ele.order))
                    ps.push(ele.price)
                })
                setSum(ps)
                setProducts(arr)
            })
        } 
        let total = 0
        products.forEach(index=>{
            total = total + (index.quantity * index.price)
        })
        setSum(total)  
    },[])

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
                        <Nav.Link href="/order">Order</Nav.Link>
                        <Nav.Link className="cart-quantity" href="/cart">Cart</Nav.Link>

                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <h2>My Order</h2>

            {products.map((pro,id)=>(

                <div className="cart-table">
                    <h3>Order No. {id+1}</h3>
                <Table  variant="dark" bordered hover>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pro.map((inx,id)=>(
                            <tr>
                                <td>{id}</td>
                                <td><img width="100" src={inx.image}/></td>
                                <td>{inx.pname}</td>
                                <td>{inx.quantity}</td>
                                <td>{inx.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Card>
                    <Card.Body >
                        <Card.Title>Total Price : Rs.{sum[id]}</Card.Title>
                    </Card.Body>
                </Card>
                </div>
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

export default Order
