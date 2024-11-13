import React, { useEffect, useState } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNotifications } from '../contexts/NotificationContext';
import echo from '../echo'; // Ensure this is correctly imported

function InventoryDetail() {
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const { id } = useParams();
    const { addNotification, notifications } = useNotifications(); // Destructure both addNotification and notifications
    const [error, setError] = useState(null); // Track errors
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_INVENTORY_API_URL}/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setItem(response.data);
                setQuantity(response.data.inventory_level.quantity);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inventory item:', error);
                setError('Failed to fetch inventory item. Please try again later.');
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    useEffect(() => {
        if (!item) return;

        // Subscribe to the 'inventory-updates' channel
        const inventoryChannel = echo.channel('inventory-updates');

        // Listen for 'inventory.updated' events
        inventoryChannel.listen('inventory.updated', (data) => {
            if (data.inventory.id === item.id) {
                setItem((prevItem) => ({
                    ...prevItem,
                    inventory_level: {
                        ...prevItem.inventory_level,
                        quantity: data.quantity,
                    },
                }));
                setQuantity(data.quantity);
                addNotification({ id: Date.now(), message: `Inventory for ${item.name} updated to ${data.quantity}` });
            }
        });

        return () => {
            echo.leaveChannel('inventory-updates');
        };
    }, [item, addNotification]);

    // Handle save button to update quantity
    const handleUpdateQuantity = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_INVENTORY_API_URL}/items/${id}/update-quantity`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            alert('Quantity updated');
            setItem(response.data);
            setQuantity(response.data.inventory_level.quantity);
            setError(null); // Clear any existing errors
        } catch (error) {
            console.error('Error updating quantity:', error);
            setError('Failed to update quantity. Please try again.');
            alert('Failed to update quantity');
        }
    };

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    );

    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
            </Alert>
        </Container>
    );

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>SKU: {item.sku}</Card.Text>
                    <Card.Text>Current Quantity: {item.inventory_level.quantity}</Card.Text>
                    <Form onSubmit={handleUpdateQuantity}>
                        <Form.Group controlId="formQuantity" className="mb-3">
                            <Form.Label>Update Quantity:</Form.Label>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={quantity === item.inventory_level.quantity}>
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="mt-3">
                {/*<h4>Notifications:</h4>*/}
                {notifications.map((notification) => (
                    <Alert key={notification.id} variant="info">
                        {notification.message}
                    </Alert>
                ))}
            </div>
        </Container>
    );
}

export default InventoryDetail;