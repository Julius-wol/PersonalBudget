import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
// Import các component con
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';

const Dashboard = () => {
    const { state, dispatch } = useContext(BudgetContext);
    const [filter, setFilter] = useState('');

    // --- LUỒNG LOAD DỮ LIỆU TỪ DB.JSON ---
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // Lấy dữ liệu theo userId của người đang đăng nhập
                const response = await axios.get(`http://localhost:9999/expenses?userId=${state.user.id}`);

                // Đẩy dữ liệu vào Global State (Reducer)
                dispatch({ type: 'SET_EXPENSES', payload: response.data });
            } catch (error) {
                console.error("Lỗi khi load dữ liệu:", error);
            }
        };

        if (state.user) {
            fetchExpenses();
        }
    }, [state.user, dispatch]);

    // Logic lọc dữ liệu theo Category (yêu cầu đề bài)
    const filteredExpenses = state.expenses.filter(item =>
        item.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row>
                    {/* Cột bên trái: Form nhập liệu */}
                    <Col md={4}>
                        <ExpenseForm />
                    </Col>

                    {/* Cột bên phải: Danh sách chi tiêu (Load từ db.json) */}
                    <Col md={8}>
                        <Card className="shadow p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Expense Management</h4>
                                <input
                                    type="text"
                                    placeholder="Filter by Category..."
                                    className="form-control w-50"
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                            </div>

                            <Table striped bordered hover responsive>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.length > 0 ? (
                                        filteredExpenses.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{Number(item.amount).toLocaleString()} VND</td>
                                                <td>{item.category}</td>
                                                {/* Format date từ YYYY-MM-DD sang DD-MM-YYYY */}
                                                <td>{item.date.split('-').reverse().join('-')}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning me-2">Edit</button>
                                                    <button className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No expenses found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;