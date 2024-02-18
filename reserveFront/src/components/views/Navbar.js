import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Your App Name</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                    <Nav.Link as={Link} to="/reservations">Reservations</Nav.Link>
                    <Nav.Link as={Link} to="/users">Users</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;