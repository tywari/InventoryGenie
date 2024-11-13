import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeOrder from './pages/MakeOrder';
import {NotificationProvider} from "./contexts/NotificationContext";

function App() {
    return (
        <NotificationProvider>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Wrap protected routes with PrivateRoute */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/inventory/:id" element={<InventoryDetail />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/make-order" element={<MakeOrder />} />
                </Route>
            </Routes>
        </Router>
        </NotificationProvider>
    );
}

export default App;
