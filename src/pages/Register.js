import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');

    const { dispatch } = useContext(BudgetContext);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // --- VALIDATION ---
        if (!username.trim() || !password.trim() || !fullName.trim()) {
            setError('All fields are required!');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long!');
            return;
        }
        if (!username.startsWith('DE')) {
            setError('Username must start with "DE" (e.g., DE123456)');
            return;
        }

        try {
            const res = await axios.get('http://localhost:9999/users');
            const users = res.data;
            const existed = users.find(u => u.username === username);
            if (existed) {
                setError('Username already exists!');
                return;
            }
            // Tạo user mới
            const newUser = { username, password, fullName };
            await axios.post('http://localhost:9999/users', newUser);
            navigate('/login');
        } catch (err) {
            setError('Server error! Please check if json-server is running.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Register</Card.Title>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. DE123456"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>FullName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your fullname"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
export default Register;