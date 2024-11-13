import React, { useEffect, useState } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';
import { Table, Container, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

    const fetchOrders = async (page, limit) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_ORDER_API_URL}/orders`, {
                params: { page, limit },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setOrders(response.data.data); // Assuming `data` contains orders
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <Container className="mt-5">
            <h2>Orders</h2>
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
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total Price</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>
                            <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                        </td>
                        <td>{order.status}</td>
                        <td>${parseFloat(order.total_price || 0).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-3">
                <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
        </Container>
    );
}

export default OrderList;
