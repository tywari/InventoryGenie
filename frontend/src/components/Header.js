import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../services/auth';
import NotificationBell from './NotificationBell';

function Header() {
    const navigate = useNavigate();
    const isAuthenticated = !!getToken();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    InventoryGenie
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated ? (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/dashboard">
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link as={Link} to="/inventory">
                                    Inventory
                                </Nav.Link>
                                <Nav.Link as={Link} to="/orders">
                                    Orders
                                </Nav.Link>
                                <Nav.Link as={Link} to="/make-order">
                                    Make Order
                                </Nav.Link>
                            </Nav>
                            <Nav>
                                <NavDropdown title={`Welcome, ${user?.name}`} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            {/*<NotificationBell />*/}
                        </>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/">
                                Register
                            </Nav.Link>
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;