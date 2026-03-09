import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { dispatch } = useContext(BudgetContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // --- BẮT ĐẦU VALIDATION ---

        // 1. Kiểm tra trống
        if (!username.trim() || !password.trim()) {
            setError('Username and Password must not be empty!');
            return;
        }

        // 2. Kiểm tra độ dài (ít nhất 6 ký tự)
        if (password.length < 6) {
            setError('Username must be at least 6 characters long!');
            return;
        }

        // 3. Kiểm tra tiền tố "DE" (Nếu đề bài yêu cầu cụ thể)
        // Lưu ý: startsWith('DE') phân biệt hoa thường. Dùng toUpperCase() nếu muốn linh hoạt.
        if (!username.startsWith('DE')) {
            setError('Username must start with "DE" (e.g., DE123456)');
            return;
        }

        // --- KẾT THÚC VALIDATION ---

        try {
            const res = await axios.get('http://localhost:9999/users');
            const users = res.data;

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch({ type: 'LOGIN', payload: user });
                navigate('/dashboard');
            } else {
                setError('Invalid username or password!');
            }
        } catch (err) {
            setError('Server error! Please check if json-server is running.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">🔐 Member Login</Card.Title>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
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
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;