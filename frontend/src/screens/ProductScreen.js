import React, { useState,  useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from "../actions/productActions"
import Loader from '../components/Loader'
import Message from "../components/Message"



const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)

    const { loading, error, product } = productDetails

    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    return (
    <>
        <Link to="/" >
          <Button className="btn btn-light my-3">Go Back</Button>
            </Link>
            { loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
             <Row className="product-page-grid-cont" >
                <Col md={6} className="product-page-section">
                    <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={3} className="product-page-section">
                    <ListGroupItem variant="flush" >
                        <h3>{product.name}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroupItem>
                        <ListGroupItem>
                            Price: ${product.price}
                        </ListGroupItem>
                    <ListGroupItem>
                        Description: {product.description}
                    </ListGroupItem>
                    </Col>
                    <Col md={3} className="product-page-section">
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col>
                                            Price:
                                        </Col>
                                        <Col>
                                            <strong>
                                                ${product.price}
                                            </strong>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row >
                                        <Col>
                                            Status:
                                        </Col>
                                        <Col>
                                            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                                        </Col>
                                    </Row>
                                </ListGroupItem>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col className="col-5">Qty:</Col>
                                            <Col className="col-7">
                                                    <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                         <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        )) }
                                                    </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}


                                <ListGroupItem>
                                    <Button
                                        onClick={addToCartHandler}
                                        className="btn btn-block" type="button" disabled={product.countInStock === 0} >
                                        Add to Cart
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
            </Row>
            )}
    </>
    )
}

export default ProductScreen
