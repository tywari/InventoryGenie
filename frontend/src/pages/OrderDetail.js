import React, { useEffect, useState } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup, Spinner, Button, Form, Alert } from 'react-bootstrap';
import echo from '../echo';


function OrderDetail() {
    const [userId, setUserId] = useState(1);
    const [order, setOrder] = useState(null);
    const [editStatus, setEditStatus] = useState(null); // Track edited status
    const [error, setError] = useState(null); // Track errors
    const { id } = useParams();

    // Define available status options
    const statusOptions = ['pending', 'processing', 'completed', 'cancelled'];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_ORDER_API_URL}/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                setOrder(response.data);
                setEditStatus(response.data.status); // Set initial status
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to fetch order details. Please try again later.');
            }
        };
        fetchOrder();
    }, [id]);

    // Handle save button to update status
    const handleSaveStatus = async () => {
        try {
            // API request to update status on the backend
            const response = await axios.put(
                `${process.env.REACT_APP_ORDER_API_URL}/orders/${order.id}`,
                { status: editStatus, user_id: userId },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setOrder((prevOrder) => ({
                ...prevOrder,
                status: editStatus,
            }));

            alert('Status updated successfully!');
            setError(null); // Clear any existing errors
        } catch (err) {
            console.error('Failed to update status:', err);
            setError('Failed to update status. Please try again.');
        }
    };

    // Real-time updates via Pusher
    useEffect(() => {
        if (!order) return;

        // Subscribe to the 'inventory-updates' channel
        const inventoryChannel = echo.channel('order-updates');

        // Listen for 'inventory.updated' events
        inventoryChannel.listen('order.status_changed', (data) => {
            if (data.order_id === order.id) {
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    status: data.status,
                }));
                setEditStatus(data.status);
                alert(`Order status updated to ${data.status}`);
            }
        });

        return () => {
            echo.leaveChannel('order-updates');
        };
    }, [order, echo]);

    if (!order) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    );

    return (
        <Container className="mt-5">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            <Card className="mb-4">
                <Card.Header as="h2">Order #{order.id}</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="formStatus" className="mb-3">
                            <Form.Label><strong>Status:</strong></Form.Label>
                            <Form.Select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="d-inline w-auto ms-2"
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        disabled={status === order.status} // Disable the current status
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button
                                variant="success"
                                onClick={handleSaveStatus}
                                className="ms-2"
                                disabled={editStatus === order.status} // Disable save if status hasn't changed
                            >
                                Save
                            </Button>
                        </Form.Group>
                        <Form.Group controlId="formTotalPrice" className="mb-3">
                            <Form.Label><strong>Total Price:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={`$${parseFloat(order.total_price || 0).toFixed(2)}`}
                                readOnly
                                plaintext
                            />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header as="h3">Items</Card.Header>
                <ListGroup variant="flush">
                    {order.items.map((item) => (
                        <ListGroup.Item key={item.id}>
                            <div><strong>Item ID:</strong> {item.item_id}</div>
                            <div><strong>Quantity:</strong> {item.quantity}</div>
                            <div><strong>Price:</strong> ${parseFloat(item.price || 0).toFixed(2)}</div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
}

export default OrderDetail;