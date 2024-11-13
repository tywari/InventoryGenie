import React, { useEffect, useState } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';
import { Table, Container, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function InventoryList() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    return (
        <Container className="mt-5">
            <h2>Inventory Items</h2>
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
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Threshold</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <Link to={`/inventory/${item.id}`}>{item.name}</Link>
                        </td>
                        <td>{item.sku}</td>
                        <td>{item.inventory_level.quantity}</td>
                        <td>{item.inventory_level.threshold}</td>
                    </tr>
                ))}
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
        </Container>
    );
}

export default InventoryList;
