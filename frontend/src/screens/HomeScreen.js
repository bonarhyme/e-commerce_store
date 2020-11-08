import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap"
import Product from "../components/Product"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Paginate from "../components/Paginate"
import Meta from "../components/Meta"



import { listProducts } from "../actions/productActions"
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword

    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <>
            <Meta title="This is it" />
            <Row>
                <Col md={6}>
                    {!keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-light">Go Back</Link>}
                </Col>
                <Col md={3}>
                    <p>LIsts for some stuff</p>
                </Col>
                <Col md={3}>
                    <p>Some other things</p>
                </Col>
            </Row>

            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant="danger">Network connection weak or unavailable to load products</Message> : (
            <>
                <Row>
                    {products && products.length && products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>

                    ))}
                </Row>
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} />
            </>
            ) }
        </>
    )
}

export default HomeScreen
