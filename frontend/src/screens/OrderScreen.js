import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import LoaderBricks from "../components/LoaderBricks"
import { getOrderDetails, payOrder, deliverOrder,} from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET} from '../constants/orderConstants'
import { usePaystackPayment } from 'react-paystack';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [publicKey, setPublicKey] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      setSdkReady(true)
      setEmail(order.user.email)
      setAmount(order.totalPrice)

    }
  }, [dispatch, orderId, successPay, successDeliver, order, history, userInfo])

  useEffect(() => {
    if (order) {
      console.log(amount)
      console.log(email)
    }


    const getPaystackPublicKey = async () => {
      const { data: publicKey } = await axios.get('/api/config/paystack')
      setPublicKey(publicKey)
    }
    getPaystackPublicKey()
    // eslint-disable-next-line
  }, [])


  const config = {
    reference: (new Date()).getTime(),
    email,
    amount,
    publicKey: publicKey,
  }

    const onSuccess = (paymentResult) => {
      // Implementation for whatever you want to do with reference and after success call.
      if (paymentResult.message === "Approved") {
        dispatch(payOrder(orderId, paymentResult))
      }
    };

    // you can call this function anything
    const onClose = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      alert("Hello valued Customer, Please Don't go away!!!")
    }
    const PaystackHook = () => {
      const initializePayment = usePaystackPayment(config);
      return (
        <div>
          <Button className="btn btn-primary btn-block" onClick={() => {
            initializePayment(onSuccess, onClose)
          }}>Pay with Paystack</Button>
        </div>
      )
    }


  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x NGN {item.price} = NGN {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>NGN {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>NGN {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>NGN {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>NGN {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>


              {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <LoaderBricks />}
                {!sdkReady ? (
                  <LoaderBricks />
                ) : (
                <PaystackHook />
                )}
              </ListGroup.Item>
                )}

              {loadingDeliver && <LoaderBricks />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
