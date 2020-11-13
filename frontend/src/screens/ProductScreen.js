import React, { useState,  useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails, createProductReview } from "../actions/productActions"
import Loader from '../components/Loader'
import Message from "../components/Message"
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants"
import  Meta  from "../components/Meta"



const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {success: successProductReview, error: errorProductReview, loading: loadingProductReview, } = productReviewCreate

    useEffect(() => {
        if(successProductReview){
            setRating(0)
            setComment("")
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        if (!product._id || product._id !== match.params.id) {
            dispatch(listProductDetails(match.params.id))
        }
    }, [dispatch, match, successProductReview, product._id])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id, {
            rating,
            comment
        }))
    }

    return (
    <>
        <Link to="/" >
          <Button className="btn btn-light my-3">Go Back</Button>
            </Link>
            { loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <>
                    <Meta title={product.name} />
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
                            Price: NGN{product.price}
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
                                                NGN{product.price}
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

            <Row>
                    <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant="flush">
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <h2>Write a Customer Review</h2>
                                  {successProductReview && (
                                    <Message variant='success'>
                                      Review submitted successfully
                                    </Message>
                                  )}
                                  {loadingProductReview && <Loader />}
                                {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
                                {userInfo ? (<Form onSubmit={submitHandler}>
                                    <Form.Group controlId="rating">
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                                            <option value="">Select...</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">4 - Ver Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="comment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" row="4" value={comment} onChange={(e) => setComment(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>
                                    <Button type="submit" variant="primary" disabled={loadingProductReview}>Submit</Button>
                                </Form>) : <Message>Please <Link to="/login">Sign in</Link> to write a review</Message>}
                            </ListGroup>
                    </Col>
            </Row>
            </>
            )}
    </>
    )
}

export default ProductScreen
