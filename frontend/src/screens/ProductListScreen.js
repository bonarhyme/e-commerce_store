import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts } from "../actions/productActions"

// notice the history, it is as object and used as props
const ProductList = ({ history, match }) => {
    const dispatch = useDispatch()

    // Handles users listing
    const productList = useSelector(state => state.productList)
    const { loading, error, products } = productList

    // For security Issues  **The secondLine gets userInfo from the userAction
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // Dispatches users list
    useEffect(() => {
        // This makes sure that only the users sees userList
        if (userInfo && userInfo.isAdmin) {
            dispatch(listProducts())
        } else {
            history.push("/login")
        }
        // History and dispatch is used as dependency
    }, [dispatch, history, userInfo])

    const deleteHandler = (id) => {
        // if(window.confirm("Are you sure you want to delete this user?"))
        //Delete Products
    }

    const createProductHandler = (product) => {
        //Create Product
    }

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                       <i className="fas fa-plus"></i> Create product
                    </Button>
                </Col>
            </Row>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant="light" className="btn-sm">
                                            <i className="fas fa-edit" title="Edit product"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                        <i className="fas fa-trash" title="Delete product"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
          )}
        </>
    )
}

export default ProductList
