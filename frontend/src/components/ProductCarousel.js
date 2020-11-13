import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { Image, Carousel } from "react-bootstrap"
import Message from "./Message"
import { listTopProducts } from "../actions/productActions"
import { useDispatch, useSelector } from 'react-redux'
import LoaderBricks from './LoaderBricks'

const ProductCarousel = () => {
    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const { loading, error, products } = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])


    return loading ? <LoaderBricks /> : error ? (<Message variant= "danger" >Network connection weak or unavailable to load products</Message>) : (
        <Carousel pause="hover" className="bg-dark w-100">
            {products && products.length && products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} className="d-block w-100 h-auto" />
                        <Carousel.Caption className="carousel-caption">
                            <h2>{product.name} ({product.price}) </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel
