import React, {useEffect, useState} from 'react';
import { Container } from 'react-bootstrap';
import axios from "axios";
import {getToken} from "../services/auth";

function Dashboard() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get(`${process.env.REACT_APP_AUTH_API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setUser(response.data);
        };
        fetchUser();
    }, []);

    return (
        <Container className="mt-5 text-center">
            <h2>{user.name}, Welcome to InventoryGenie Dashboard</h2>
            <p>Select an option from the menu to get started.</p>
        </Container>
    );
}

export default Dashboard;