import React, { useEffect, useState } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';
import { Container, Form, Button, Table } from 'react-bootstrap';

function MakeOrder() {
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [userId, setUserId] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

    const fetchItems = async (page, limit) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_INVENTORY_API_URL}/items`, {
                params: { page, limit },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setItems(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching items", error);
        }
    };

    useEffect(() => {
        fetchItems(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleQuantityChange = (itemId, quantity) => {
        setOrderItems((prevOrderItems) => {
            const existingItem = prevOrderItems.find((oi) => oi.item_id === itemId);
            if (existingItem) {
                return prevOrderItems.map((oi) =>
                    oi.item_id === itemId ? { ...oi, quantity } : oi
                );
            } else {
                return [...prevOrderItems, { item_id: itemId, quantity }];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const filteredOrderItems = orderItems.filter((oi) => oi.quantity > 0);
        if (filteredOrderItems.length === 0) {
            alert('Please select at least one item.');
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_ORDER_API_URL}/orders`,
                {
                    user_id: userId,
                    items: filteredOrderItems,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            alert('Order created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create order.');
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    return (
        <Container className="mt-5">
            <h2>Create a New Order</h2>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between mb-3">
                    <Form.Group controlId="itemsPerPageSelect">
                        <Form.Label>Items per page:</Form.Label>
                        <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </Form.Control>
                    </Form.Group>
                </div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Available Quantity</th>
                        <th>Order Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => {
                        const currentOrderItem = orderItems.find((oi) => oi.item_id === item.id) || {};
                        return (
                            <tr key={item.id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={currentOrderItem.quantity > 0}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                item.id,
                                                e.target.checked ? 1 : 0
                                            )
                                        }
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.sku}</td>
                                <td>{item.inventory_level.quantity}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        max={item.inventory_level.quantity}
                                        value={currentOrderItem.quantity || 0}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, parseInt(e.target.value))
                                        }
                                        disabled={!currentOrderItem.quantity > 0}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                    <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
                <Button variant="primary" type="submit" className="mt-3">
                    Create Order
                </Button>
            </Form>
        </Container>
    );
}

export default MakeOrder;
