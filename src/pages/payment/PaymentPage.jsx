import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { httpClient } from '../../utils/AxiosHttpClient';
import CircleLoading from '../../components/CircleLoading/CircleLoading';

const PaymentPage = () => {
    const location = useLocation();
    const { orderId } = location.state || {};

    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await httpClient.get(`/api/v1/orders/${orderId}`);
                console.log(response.data);
                setOrderDetails(response.data.data); // Set orderDetails with the correct data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handlePayment = async () => {
        try {
            const response = await createPayment(orderId);
            if (response.isSuccess) {
                // Redirect user to paymentUrl
                window.location.href = response.data.paymentUrl;
            } else {
                console.error('Failed to create payment:', response.message);
                // Handle payment creation failure
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            // Handle error
        }
    };

    const createPayment = async (orderId) => {
        try {
            const paymentInfo = {
                PaymentContent: 'Payment for course order',
                RequiredAmount: orderDetails.totalPrice,
                OrderId: orderId,
            };
            const response = await httpClient.post('/api/v1/payments/create', paymentInfo);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create payment');
        }
    };

    const getOrderStatusBadge = (status) => {
        switch (status) {
            case 1:
                return <Badge bg="warning">Progressing</Badge>;
            case 2:
                return <Badge bg="secondary">Draft</Badge>;
            case 3:
                return <Badge bg="success">Success</Badge>;
            case 4:
                return <Badge bg="danger">Cancel</Badge>;
            default:
                return <Badge bg="light">Unknown</Badge>;
        }
    };

    if (loading) {
        return <CircleLoading />;
    }

    return (
        <Container style={{marginTop: '160px'}}>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Order Details</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Order ID:</strong> {orderDetails.orderId}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Orderer Name:</strong> {orderDetails.ordererName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Total Price:</strong> {orderDetails.totalPrice} VND
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Order Date:</strong> {new Date(orderDetails.orderItems[0].orderDate).toLocaleDateString()}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Expire Date:</strong> {new Date(orderDetails.orderItems[0].expireDate).toLocaleDateString()}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Status:</strong> {getOrderStatusBadge(orderDetails.status)}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Payment Methods</Card.Header>
                        <Card.Body>
                            <Button variant="primary" onClick={handlePayment}>
                                Pay with VNPay
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentPage;